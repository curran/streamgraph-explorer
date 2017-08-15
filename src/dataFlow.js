import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import aggregateBy from './aggregateBy';
import interpolate from './interpolate';

const dataFlow = ReactiveModel();

// Declare reactive properties used as inputs.
dataFlow
  ('packedData')
  ('containerBox')
  ('srcStreamBox')
  ('destStreamBox');

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// Compute the array of all years covered by the data (Date objects).
dataFlow('allYears', packedData => {
  return Object.keys(packedData.nested)
    .map(yearStr => new Date(yearStr));
}, 'packedData');

// TODO filter by selected types, selected origin, and selected destination
dataFlow('dataFiltered', d => d, 'data');

// Compute aggregated data by source and destination (after filtering).
dataFlow('dataBySrc', aggregateBy('src'), 'dataFiltered');
dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

// TODO filter keys to show top N by sum.
const keys = nestedData => nestedData.map(d => d.key);
dataFlow('srcKeys', keys, 'dataBySrc');
dataFlow('destKeys', keys, 'dataByDest');

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamData', interpolate, 'allYears, dataBySrc');
dataFlow('destStreamData', interpolate, 'allYears, dataByDest');

dataFlow(d => console.log(d), 'srcKeys');

export default dataFlow;
