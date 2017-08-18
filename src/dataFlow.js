import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import aggregateBy from './aggregateBy';
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
  ('src', null) // The currently selected source (null means no selection).
  ('dest', null) // The currently selected destination (null means no selection).
  ('maxStreamLayers', 50) // The maximum number of layers in a StreamGraph.
  ('minStreamMax', 100) // Layers with maxima below this are excluded.
;

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// Compute the array of all years covered by the data (Date objects).
dataFlow('allYears', packedData => {
  return Object.keys(packedData.nested)
    .map(yearStr => new Date(yearStr));
}, 'packedData');

// TODO filter by selected types, selected origin, and selected destination
dataFlow('dataFiltered', (data, src, dest) => {
  data = src ? data.filter(d => d.src === src) : data;
  return dest ? data.filter(d => d.dest === dest) : data;
}, 'data, src, dest');

// Compute aggregated data by source and destination (after filtering).
dataFlow('dataBySrc', aggregateBy('src'), 'dataFiltered');
dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

// Compute keys, top N (maxStreamLayers) sorted by max value.
dataFlow('srcKeys', keys, 'dataBySrc, maxStreamLayers, minStreamMax');
dataFlow('destKeys', keys, 'dataByDest, maxStreamLayers, minStreamMax');

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamData', interpolate, 'allYears, dataBySrc');
dataFlow('destStreamData', interpolate, 'allYears, dataByDest');

// Initialize the routing system that uses URL hash
// to store pieces of the state.
hashRouting(dataFlow, ['src', 'dest']);

//dataFlow(d => console.log(d), 'src');

export default dataFlow;
