#!/bin/bash

webPage="index.html"

echo "<html>" > $webPage

#Loop over folders in directory
echo "<ul id=\"menu\">" >> $webPage
for folder in `ls -d */`; do
  # folderWithoutLastChar=${folder::-1}
  folderWithoutLastChar=${folder%?} #copilot code

  echo "  <li><a href=\"$folderWithoutLastChar/index.html\">$folderWithoutLastChar</a></li>" >> $webPage
done

echo "</ul>" >> $webPage

echo "</html>" >> $webPage

