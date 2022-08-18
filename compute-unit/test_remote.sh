#!/bin/bash

stty -F /dev/serial0 raw speed 1000000
echo "fe f0 01 00 00 06 00 aa bb cc dd ee ff ff" | xxd -r -p > /dev/serial0
