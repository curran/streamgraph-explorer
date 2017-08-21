import { extent } from 'd3-array';
import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import { aggregateBy, aggregateByYears } from './aggregateBy';
import interpolate from './interpolate';
import keys from './keys';
import hashRouting from './hashRouting';

const dataFlow = ReactiveModel();

// Declare reactive properties used as inputs.
dataFlow
  ('packedData') // The data loaded directly from JSON.
  ('containerBox') // Dimensions of the container DIV.
  ('srcStreamBox') // Position and dimensions of the source StreamGraph.
  ('destStreamBox') // Position and dimensions of the destination StreamGraph.
  ('timePanelBox') // Position and dimensions of the time panel.
  ('contextStreamBox') // Position and dimensions of the context panel.
  ('src', null) // The currently selected source (null means no selection).
  ('dest', null) // The currently selected destination (null means no selection).
  ('maxStreamLayers', 50) // The maximum number of layers in a StreamGraph.
  ('minStreamMax', 100) // Layers with maxima below this are excluded.
  ('streamsMargin', { // The margin of the StreamGraphs and TimePanel.
    top: 0, bottom: 0, left: 20, right: 20
  })
;

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// Compute the array of all years covered by the data (Date objects).
dataFlow('allYears', packedData => {
  return Object.keys(packedData.nested)
    .map(yearStr => new Date(yearStr));
}, 'packedData');

// Compute the extent of time.
dataFlow('timeExtent', allYears => extent(allYears), 'allYears');

// TODO filter by selected types, selected origin, and selected destination
dataFlow('dataFiltered', (data, src, dest) => {
  data = src ? data.filter(d => d.src === src) : data;
  return dest ? data.filter(d => d.dest === dest) : data;
}, 'data, src, dest');

// Compute aggregated data by source and destination (after filtering).
dataFlow('dataBySrc', aggregateBy('src'), 'dataFiltered');
dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

// Compute data for context panel, aggregated by only time.
dataFlow('dataByYear', aggregateByYears, 'dataFiltered');

// Compute keys, top N (maxStreamLayers) sorted by max value.
dataFlow('srcKeys', keys, 'dataBySrc, maxStreamLayers, minStreamMax');
dataFlow('destKeys', keys, 'dataByDest, maxStreamLayers, minStreamMax');

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamData', interpolate, 'allYears, dataBySrc');
dataFlow('destStreamData', interpolate, 'allYears, dataByDest');

// Initialize the routing system that uses URL hash
// to store pieces of the state.
hashRouting(dataFlow, ['src', 'dest']);

export default dataFlow;
