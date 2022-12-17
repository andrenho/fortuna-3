package com.fortuna3.fortuna3.restcontroller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class StaticContentController {

    @GetMapping("/")
    public String redirectRoot() {
        return "forward:/index.html";
    }

}