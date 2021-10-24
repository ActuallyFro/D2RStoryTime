# RUN FIRST!!!!
# pip install networkx
# sudo apt install python-pytest
#OPTIONAL: pip install pygraphviz pydot pyyaml gdal lxml

#python -c "import networkx"

import networkx as nx
import simplejson as json
from networkx.readwrite import json_graph

# parse the gml file and build the graph object
#g = nx.read_gml('dolphins.gml')
g = nx.read_graphml('other.gxl')
# create a dictionary in a node-link format that is suitable for JSON serialization
d = json_graph.node_link_data(g)
#with open('dolphins.json', 'w') as fp:
with open('other.json', 'w') as fp:
    json.dump(d, fp)
