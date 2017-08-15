import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import { nest } from 'd3-collection';
import { sum } from 'd3-array';

const dataFlow = ReactiveModel();

// Declare reactive properties used as inputs.
dataFlow
  ('packedData')
  ('srcStreamBox')
  ('destStreamBox');

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// TODO filter by zoom interval, selected types, origin, destination
dataFlow('dataFiltered', d => d, 'data');

const aggregateBy = column => {
  const compute = nest()
    .key(d => d[column])
    .key(d => d.year)
    .rollup(values => sum(values, d => d.value));
  return data => compute.entries(data);
};

dataFlow('dataBySrc', aggregateBy('src'), 'dataFiltered');
dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

dataFlow(data => console.log(data[0]), 'dataBySrc');

export default dataFlow;
