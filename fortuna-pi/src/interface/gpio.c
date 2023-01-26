#include "gpio.h"

#include <gpiod.h>
#include <unistd.h>

#define _DEFAULT_SOURCE 1
#define RESET_GPIO 8

void gpio_reset()
{
    struct gpiod_chip* chip = gpiod_chip_open_by_name("gpiochip0");
    struct gpiod_line* reset = gpiod_chip_get_line(chip, RESET_GPIO);

    gpiod_line_request_output(reset, "fortuna-pi", 1);

    gpiod_line_set_value(reset, 0);
    usleep(50000);
    gpiod_line_set_value(reset, 1);

    gpiod_line_request_input(reset, "fortuna-pi");
    gpiod_line_release(reset);
    gpiod_chip_close(chip);
}
