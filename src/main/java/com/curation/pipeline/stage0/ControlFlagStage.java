package com.curation.pipeline.stage0;

import com.curation.config.PipelineProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ControlFlagStage {

    private final RedisTemplate<String, String> redisTemplate;
    private final PipelineProperties props;

    public ControlFlag readFlag() {
        String value = redisTemplate.opsForValue().get(props.getControlFlagKey());
        if (value == null) {
            log.warn("Control flag not set in Redis — defaulting to ON");
            return ControlFlag.ON;
        }
        try {
            return ControlFlag.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Unknown control flag value '{}' — defaulting to PAUSE", value);
            return ControlFlag.PAUSE;
        }
    }

    public void setFlag(ControlFlag flag) {
        redisTemplate.opsForValue().set(props.getControlFlagKey(), flag.name());
        log.info("Pipeline control flag set to {}", flag);
    }

    public enum ControlFlag {
        ON, PAUSE, OFF
    }
}
