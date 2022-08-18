#!/bin/bash

stty -F /dev/serial0 raw speed 1000000
echo "fe f0 01" | xxd -r -p > /dev/serial0
sleep 0.5
echo "00 00 00 06 00" | xxd -r -p > /dev/serial0
sleep 0.1
echo "aa bb cc dd ee ff ff" | xxd -r -p > /dev/serial0
sleep 0.1
echo "ff" | xxd -r -p > /dev/serial0
sleep 0.1
