import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import { nest } from 'd3-collection';
import { sum } from 'd3-array';

const dataFlow = ReactiveModel();

// Declare reactive properties.
dataFlow('packedData');

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// TODO filter by selected types, origin, destination
dataFlow('dataFiltered', d => d, 'data');

dataFlow('dataBySrc', dataFiltered => {
  return nest()
    .key(function (d) { return d.src; })
    .key(function (d) { return d.year; })
    .rollup(function(values) {
      return sum(values, function(d) {
        return d.Value;
      })
    })
    .entries(dataFiltered);
}, 'dataFiltered');

dataFlow(data => console.log(data[0]), 'dataBySrc');

export default dataFlow;
