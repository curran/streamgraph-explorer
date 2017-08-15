import { json } from 'd3-request';
import computeLayout from 'chiasm-layout/src/computeLayout';
import dataFlow from './dataFlow';

json('data/time_series.json', dataFlow.packedData);

const layout = {
  orientation: 'vertical',
  children: [ 'srcStreams', 'destStreams' ]
};
const sizes = {}
const box = {
  width: 500,
  height: 500
};

console.log(computeLayout(layout, sizes, box));
