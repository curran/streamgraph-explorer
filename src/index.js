import { json } from 'd3-request';
import { select } from 'd3-selection';
import dataFlow from './dataFlow';
import layout from './layout';

// Load the data into the data flow graph.
json('data/time_series.json', dataFlow.packedData);

// Select the div that will contain everything.
const container= document.getElementById('container');

// Set up the layout that responds to resize.
layout(container, dataFlow);

// Scaffold the SVG DOM tree within the container.
const svg = select(container).append('svg');
const srcStreamsG = svg.append('g');
const destStreamsG = svg.append('g');

dataFlow
  (d => console.log(d), 'srcStreamsBox')
