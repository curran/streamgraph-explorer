import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import aggregateBy from './aggregateBy';
import interpolate from './interpolate';
import keys from './keys';

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
dataFlow('srcKeys', keys, 'dataBySrc, maxStreamLayers');
dataFlow('destKeys', keys, 'dataByDest, maxStreamLayers');

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamData', interpolate, 'allYears, dataBySrc');
dataFlow('destStreamData', interpolate, 'allYears, dataByDest');

// Update the URL hash based on src and dest.
dataFlow((src, dest) => {
  const params = {src, dest};
  const hash = JSON.stringify(params);
  window.location.hash = hash;
}, 'src, dest');

// On page load, pass the state encoded in the URL
// into the data flow graph.
const hash = window.location.hash.substr(1);
if (hash.length > 0) {
  const params = JSON.parse(hash);
  Object.keys(params).forEach(key => {
    dataFlow[key](params[key]);
  });
}

//dataFlow(d => console.log(d), 'src');

export default dataFlow;
