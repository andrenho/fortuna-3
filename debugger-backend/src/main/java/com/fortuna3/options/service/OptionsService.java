package com.fortuna3.options.service;

import com.fortuna3.options.dto.Options;
import com.fortuna3.options.mapper.OptionsMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OptionsService {

    @Getter
    private final Options options = new Options();

    private final OptionsMapper optionsMapper;

    public void updateOptions(Options options) {
        optionsMapper.overrideOptionFields(this.options, options);
    }
}
