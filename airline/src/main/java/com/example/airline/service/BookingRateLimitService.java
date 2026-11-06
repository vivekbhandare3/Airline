package com.example.airline.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.util.Collections;

/** Fixed-window, per-user rate limiter for booking requests, backed by Redis. */
@Service
public class BookingRateLimitService {

    private static final Logger log = LoggerFactory.getLogger(BookingRateLimitService.class);

    private final StringRedisTemplate redisTemplate;

    // Allow at most MAX_REQUESTS per user in each WINDOW_SECONDS window. Tune for your traffic.
    private static final int MAX_REQUESTS = 10;
    private static final int WINDOW_SECONDS = 10;

    public BookingRateLimitService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // INCR and EXPIRE run atomically inside one Lua script, so a crash between the two
    // calls can never leave a counter that never expires.
    private static final DefaultRedisScript<Long> RATE_LIMIT_SCRIPT =
            new DefaultRedisScript<>(
                    """
                    local count = redis.call('INCR', KEYS[1])

                    if count == 1 then
                        redis.call('EXPIRE', KEYS[1], ARGV[1])
                    end

                    return count
                    """,
                    Long.class
            );

    /** Returns true if the user is allowed to make this request. */
    public boolean isAllowed(String userId) {

        if (userId == null || userId.isBlank()) {
            // Never share one "null" identity between users.
            return false;
        }

        String key = "rate-limit:booking:" + userId;

        try {
            Long count = redisTemplate.execute(
                    RATE_LIMIT_SCRIPT,
                    Collections.singletonList(key),
                    String.valueOf(WINDOW_SECONDS)
            );

            if (count == null) {
                // Fail open: prefer availability if Redis gives no answer.
                log.warn("Rate-limit result unavailable; allowing request.");
                return true;
            }

            return count <= MAX_REQUESTS;

        } catch (Exception e) {
            // A Redis outage must not block bookings.
            log.error("Redis rate limiting unavailable; allowing request.", e);
            return true;
        }
    }
}
