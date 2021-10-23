#!/bin/bash

webPage="index.html"

echo "<html>" > $webPage



#Loop over folders in directory
echo "<ul id=\"menu\">" >> $webPage
for folder in `ls -d */`; do
  # do echo "<$folder" >> $webPage
  echo "  <li><a href=\"$folder/index.html\">$folder</a></li>" >> $webPage
  # echo "  <li><a href=\"test_nodes.html\">Nodes</a></li>" >> $webPage
  # echo "  <li><a href=\"test_links.html\">Links</a></li>" >> $webPage
done
echo "</ul>" >> $webPage

echo "</html>" >> $webPage

