package com.example.airline.service;

import com.example.airline.repository.FlightRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Probabilistic filter of valid flight IDs, backed by the RedisBloom module's Cuckoo filter
 * (a Bloom-filter variant that also supports deletes). It answers "definitely not a flight"
 * or "probably a flight", so requests for IDs that do not exist are rejected before they
 * reach the cache or MySQL (prevents cache penetration).
 *
 * Fails open: if Redis or the filter is unavailable, every ID is allowed through to the database.
 * Requires Redis Stack / the RedisBloom module (CF.* commands).
 */
@Slf4j
@Service
public class FlightBloomFilterService implements ApplicationRunner {

    private static final String FILTER_KEY = "flight:cuckoo:ids";
    private static final long CAPACITY = 100_000;

    private static final DefaultRedisScript<Long> ADD_SCRIPT =
            new DefaultRedisScript<>("return redis.call('CF.ADDNX', KEYS[1], ARGV[1])", Long.class);

    private static final DefaultRedisScript<Long> DEL_SCRIPT =
            new DefaultRedisScript<>("return redis.call('CF.DEL', KEYS[1], ARGV[1])", Long.class);

    private static final DefaultRedisScript<Long> EXISTS_SCRIPT = new DefaultRedisScript<>(
            """
            if redis.call('EXISTS', KEYS[1]) == 0 then
                return -1
            end
            return redis.call('CF.EXISTS', KEYS[1], ARGV[1])
            """, Long.class);

    private static final DefaultRedisScript<String> RESERVE_SCRIPT =
            new DefaultRedisScript<>("return redis.call('CF.RESERVE', KEYS[1], ARGV[1])", String.class);

    private final StringRedisTemplate redisTemplate;
    private final FlightRepository flightRepository;
    private final AtomicBoolean initialized = new AtomicBoolean(false);

    public FlightBloomFilterService(StringRedisTemplate redisTemplate,
                                    FlightRepository flightRepository) {
        this.redisTemplate = redisTemplate;
        this.flightRepository = flightRepository;
    }

    /** Runs once at startup: rebuilds the filter from all flight IDs in MySQL. */
    @Override
    public void run(ApplicationArguments args) {
        try {
            redisTemplate.delete(FILTER_KEY);
            redisTemplate.execute(RESERVE_SCRIPT,
                    Collections.singletonList(FILTER_KEY), String.valueOf(CAPACITY));

            List<Long> ids = flightRepository.findAllFlightIds();
            for (Long id : ids) {
                addFlightId(id);
            }

            initialized.set(true);
            log.info("Cuckoo filter initialized with {} flight IDs", ids.size());
        } catch (Exception e) {
            log.error("Cuckoo filter initialization failed; falling back to database", e);
        }
    }

    public void addFlightId(Long id) {
        if (id == null) return;
        try {
            redisTemplate.execute(ADD_SCRIPT, Collections.singletonList(FILTER_KEY), id.toString());
        } catch (Exception e) {
            log.warn("Failed to add flight {} to filter: {}", id, e.getMessage());
        }
    }

    public void removeFlightId(Long id) {
        if (id == null) return;
        try {
            redisTemplate.execute(DEL_SCRIPT, Collections.singletonList(FILTER_KEY), id.toString());
        } catch (Exception e) {
            log.warn("Failed to remove flight {} from filter: {}", id, e.getMessage());
        }
    }

    public boolean mightExist(Long id) {
        if (id == null) return false;

        // Not initialized yet: never reject a valid flight.
        if (!initialized.get()) return true;

        try {
            Long result = redisTemplate.execute(
                    EXISTS_SCRIPT, Collections.singletonList(FILTER_KEY), id.toString());

            if (result == null || result == -1L) return true;
            return result == 1L;
        } catch (Exception e) {
            log.warn("Cuckoo filter unavailable; allowing database fallback: {}", e.getMessage());
            return true;
        }
    }
}
