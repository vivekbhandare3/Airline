package com.example.airline.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import tools.jackson.databind.jsontype.BasicPolymorphicTypeValidator;

import java.time.Duration;
import java.util.concurrent.ThreadLocalRandom;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {

        // Typed JSON serializer: stores an "@class" marker so cached DTOs are rebuilt as the
        // correct Java class. The allow-list stops Jackson from instantiating arbitrary classes
        // (deserialization attack) if someone could write to Redis.
        GenericJacksonJsonRedisSerializer typed = GenericJacksonJsonRedisSerializer.builder()
                .enableDefaultTyping(BasicPolymorphicTypeValidator.builder()
                        .allowIfSubType("com.example.airline")
                        .allowIfSubType("java.util.")
                        .allowIfSubType("java.time.")
                        .allowIfSubType("java.lang")
                        .build())
                .build();

        // Default for any other cache (no expiry).
        RedisCacheConfiguration defaults = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(typed));

        // Flight caches: 30-45 s TTL. The random jitter spreads expiry times so entries written
        // together do not all expire together (prevents a cache avalanche on MySQL).
        RedisCacheConfiguration flightCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl((key, value) -> Duration.ofSeconds(
                        30 + ThreadLocalRandom.current().nextLong(0, 16)))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(typed));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaults)
                .withCacheConfiguration("flightSearch", flightCacheConfig)
                .withCacheConfiguration("flightDetails", flightCacheConfig)
                .build();
    }
}
