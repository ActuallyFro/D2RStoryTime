#!/bin/bash

if [[ $1 == "3.7" ]]; then
  python3.7 convertGML-to-JSON_2.py -i other.gxl -o other.json
else
  python3.8 convertGML-to-JSON_2.py -i other.gxl -o other.json
fi
