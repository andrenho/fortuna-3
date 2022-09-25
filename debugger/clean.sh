#!/bin/bash

read -p "Are you sure you want to clean? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git clean -fdx
fi
