import { json } from 'd3-request';
import { select } from 'd3-selection';
import dataFlow from './dataFlow';
import layout from './layout';
import StreamGraph from './streamGraph';
import TimePanel from './timePanel';

// Load the data into the data flow graph.
json('data/time_series.json', dataFlow.packedData);

// Select the div that will contain everything.
const container = document.getElementById('container');

// Set up the layout that responds to resize.
layout(container, dataFlow);

// Scaffold the SVG DOM tree within the container.
const svg = select(container).append('svg');
const srcStreamG = svg.append('g');
const destStreamG = svg.append('g');
const timePanelG = svg.append('g');

// Set the size of the SVG element on resize.
dataFlow(box => {
  svg.attr('width', box.width).attr('height', box.height);
}, 'containerBox');

// Render the source and destination StreamGraphs.
const stream = (title, g, onAreaClick) => (box, data, keys, margin) => {
  g.attr('transform', `translate(${box.x},${box.y})`)
    .call(StreamGraph, { box, data, keys, onAreaClick, title, margin });
};
const srcStream = stream('Origin', srcStreamG, dataFlow.src);
const destStream = stream('Destination', destStreamG, dataFlow.dest);
dataFlow(srcStream, 'srcStreamBox, srcStreamData, srcKeys, streamsMargin');
dataFlow(destStream, 'destStreamBox, destStreamData, destKeys, streamsMargin');

dataFlow('timeTicksYExtent', (srcStreamBox, destStreamBox) => ({
    y1: srcStreamBox.y,
    y2: destStreamBox.y + destStreamBox.height
}), 'srcStreamBox, destStreamBox');

dataFlow(TimePanel(timePanelG), [
  'timePanelBox',
  'streamsMargin',
  'timeExtent',
  'timeTicksYExtent'
]);
