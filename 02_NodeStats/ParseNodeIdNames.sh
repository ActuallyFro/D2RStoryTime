#!/bin/bash
count=0

for id in `cat ../D2R_Act_I.gxl | grep "<node id=" | tr " " "\n" | grep id | tr -d "\""|sed "s/id=//g" | tr -d ">"`; do
  echo "$count: $id"
  count=$((count+1))
done
