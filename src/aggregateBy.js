import { nest } from 'd3-collection';
import { sum } from 'd3-array';

// This function aggregates (sums) values grouped by the given column and by year.
const aggregateBy = column => {
  const compute = nest()
    .key(d => d[column])
    .key(d => d.year)
    .rollup(values => sum(values, d => d.value));
  return data => compute.entries(data);
};

export default aggregateBy;