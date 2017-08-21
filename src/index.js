import { json } from 'd3-request';
import { extent } from 'd3-array';
import { select } from 'd3-selection';
import dataFlow from './dataFlow';
import layout from './layout';
import StreamGraph from './streamGraph';
import ContextStream from './contextStream';
import TimePanel from './timePanel';

// Load the data into the data flow graph.
json('data/time_series.json', (packedData) => {

  // Compute the array of all years covered by the data (Date objects).
  const allYears = Object
    .keys(packedData.nested)
    .map(yearStr => new Date(yearStr));

  // Compute the extent of time.
  const timeExtent = extent(allYears);

  dataFlow.packedData(packedData);
  dataFlow.allYears(allYears);
  dataFlow.timeExtent(timeExtent);
  dataFlow.zoomExtent(timeExtent);
});

// Select the div that will contain everything.
const container = document.getElementById('container');

// Set up the layout that responds to resize.
layout(container, dataFlow);

// Scaffold the SVG DOM tree within the container.
const svg = select(container).append('svg');
const timePanelG = svg.append('g');
const srcStreamG = svg.append('g');
const destStreamG = svg.append('g');
const contextStreamG = svg.append('g');

// Set the size of the SVG element on resize.
dataFlow(box => {
  svg.attr('width', box.width).attr('height', box.height);
}, 'containerBox');

// Render the source and destination StreamGraphs.
const stream = (title, g, onAreaClick) => {
  return (box, data, keys, margin, showLabels) => {
    g.attr('transform', `translate(${box.x},${box.y})`)
      .call(StreamGraph, {
        box,
        data,
        keys,
        onAreaClick,
        title,
        margin,
        showLabels
      });
  };
};
const srcStream = stream('Origin', srcStreamG, dataFlow.src);
dataFlow(srcStream, [
  'srcStreamBox',
  'srcStreamData',
  'srcKeys',
  'streamsMargin',
  'showStreamLabels'
]);

const destStream = stream('Destination', destStreamG, dataFlow.dest);
dataFlow(destStream, [
  'destStreamBox',
  'destStreamData',
  'destKeys',
  'streamsMargin',
  'showStreamLabels'
]);

dataFlow('timeTicksYExtent', (srcStreamBox, destStreamBox) => ({
    y1: srcStreamBox.y,
    y2: destStreamBox.y + destStreamBox.height
}), 'srcStreamBox, destStreamBox');

dataFlow(TimePanel(timePanelG), [
  'timePanelBox',
  'streamsMargin',
  'zoomExtent',
  'timeTicksYExtent'
]);

// Render the context panel
dataFlow((box, data, timeExtent) => {
  contextStreamG
    .attr('transform', `translate(${box.x},${box.y})`)
    .call(ContextStream, {
      box,
      data,
      timeExtent,
      onBrush: dataFlow.zoomExtent,
      onBrushStart: () => dataFlow.showStreamLabels(false),
      onBrushEnd: () => dataFlow.showStreamLabels(true)
    });
}, 'contextStreamBox, dataByYear, timeExtent');
