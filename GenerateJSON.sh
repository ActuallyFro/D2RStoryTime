#!/bin/bash

scriptName="convertD2R-GXL-files.py"
inputName="D2R_Act_I.gxl"
outputName="d2r_a1.json"

if [[ $1 == "3.7" ]]; then
  python3.7 $scriptName -i $inputName -o $outputName
else
  python3.8 $scriptName -i $inputName -o $outputName
fi
