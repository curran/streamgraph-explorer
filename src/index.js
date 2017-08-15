import { json } from 'd3-request';
import { select } from 'd3-selection';
import dataFlow from './dataFlow';
import layout from './layout';
import StreamGraph from './streamGraph';

// Load the data into the data flow graph.
json('data/time_series.json', dataFlow.packedData);

// Select the div that will contain everything.
const container= document.getElementById('container');

// Set up the layout that responds to resize.
layout(container, dataFlow);

// Scaffold the SVG DOM tree within the container.
const svg = select(container).append('svg');
const srcStreamG = svg.append('g');
const destStreamG = svg.append('g');

// Set the size of the SVG element on resize
dataFlow(box => {
  svg
      .attr('width', box.width)
      .attr('height', box.height);
}, 'containerBox');

// Render the source and destination StreamGraphs.
const renderStreamGraph = g => (box, data) => {
  g.attr('transform', `translate(${box.x},${box.y})`)
    .call(StreamGraph, { box, data });
};
dataFlow(renderStreamGraph(srcStreamG), 'srcStreamBox, dataBySrc');
dataFlow(renderStreamGraph(destStreamG), 'destStreamBox, dataByDest');
