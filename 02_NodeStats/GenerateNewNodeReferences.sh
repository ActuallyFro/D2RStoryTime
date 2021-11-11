#!/bin/bash

oFile="RunNewNodeReferences.sh"

update_source-and-target(){
  echo "" >> $oFile
  echo "sed \"s/source=\\\"$1\\\"/source=\\\"$2\\\"/g\" -i D2R_Act_I.gxl" >> $oFile
  echo "sed \"s/target=\\\"$1\\\"/target=\\\"$2\\\"/g\" -i D2R_Act_I.gxl" >> $oFile
}

echo "#!/bin/bash" > $oFile

old="0"
new="boss_04_Diablo"
update_source-and-target "$old" "$new"

old="1"
new="npc_D1_DarkWander"
update_source-and-target "$old" "$new"

old="2"
new="Cain"
update_source-and-target "$old" "$new"

old="3"
new="Akara"
update_source-and-target "$old" "$new"

old="4"
new="Gheed"
update_source-and-target "$old" "$new"

old="5"
new="Warriv"
update_source-and-target "$old" "$new"

old="6"
new="Charsi"
update_source-and-target "$old" "$new"

old="7"
new="Kaysha"
update_source-and-target "$old" "$new"

old="8"
new="Rogue Encampment"
update_source-and-target "$old" "$new"

old="9"
new="boss_01_Andariel"
update_source-and-target "$old" "$new"

old="10"
new="Tristram"
update_source-and-target "$old" "$new"

old="11"
new="Rogue Monastery"
update_source-and-target "$old" "$new"

old="12"
new="Warriv Gossip"
update_source-and-target "$old" "$new"

old="13"
new="Warriv Gossip 1"
update_source-and-target "$old" "$new"

old="14"
new="Kaysha Gossip"
update_source-and-target "$old" "$new"

old="15"
new="Charsi Gossip"
update_source-and-target "$old" "$new"

old="16"
new="Gheed Gossip"
update_source-and-target "$old" "$new"

old="17"
new="Akara Gossip"
update_source-and-target "$old" "$new"

old="18"
new="Kaysha Gossip 1"
update_source-and-target "$old" "$new"

old="19"
new="Charsi Gossip 1"
update_source-and-target "$old" "$new"

old="20"
new="Gheed Gossip 1"
update_source-and-target "$old" "$new"

old="21"
new="Akara Gossip 1"
update_source-and-target "$old" "$new"
