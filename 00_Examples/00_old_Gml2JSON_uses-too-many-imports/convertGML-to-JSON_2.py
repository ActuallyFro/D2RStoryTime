#!/usr/bin/env python

#pip3 install networkx
#pip3 install python-louvain

import sys
import argparse
import networkx as nx
import community
import json
from networkx.readwrite import json_graph

def graphmltojson(graphfile, outfile):
	"""
	Converts GraphML file to json while adding communities/modularity groups
	using python-louvain. JSON output is usable with D3 force layout.
	Usage:
	>>> python convert.py -i mygraph.graphml -o outfile.json
	"""

	G = nx.read_graphml(graphfile)

	#finds best community using louvain
	partition = community.best_partition(G)

	#adds partition/community number as attribute named 'modularitygroup'
	#for n,d in G.nodes_iter(data=True): #-- https://stackoverflow.com/questions/33734836/graph-object-has-no-attribute-nodes-iter-in-networkx-module-python

	for n, d in list(G.nodes(data=True)):
		d['group'] = partition[n]

	node_link = json_graph.node_link_data(G)
	#json = json_graph.dumps(node_link)
	#otherName_json = json.dumps(node_link)
	otherName_json = json.dumps(node_link, sort_keys=True, indent=4)

	#otherName_json = json.dump(node_link, indent=4, sort_keys=True)

	# Write to file
	fo = open(outfile, "w")

	#fo.write(json);
	fo.write(otherName_json);
	fo.close()

if __name__ == '__main__':
	parser = argparse.ArgumentParser(description='Convert from GraphML to json. ')
	parser.add_argument('-i','--input', help='Input file name (graphml)',required=True)
	parser.add_argument('-o','--output', help='Output file name/path',required=True)
	args = parser.parse_args()
	graphmltojson(args.input, args.output)
