package com.fortuna3.options.mapper;

import com.fortuna3.options.dto.Options;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class OptionsMapper {

    public Options overrideOptionFields(Options originalOptions, Options newOptions) {
        originalOptions.setCollapseMacros(Optional.ofNullable(newOptions.getCollapseMacros()).orElse(originalOptions.getCollapseMacros()));
        return originalOptions;
    }

}
