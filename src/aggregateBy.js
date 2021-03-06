import { nest } from 'd3-collection';
import { sum } from 'd3-array';

// This function aggregates (sums) values
// grouped by the given column and by year.
export const aggregateBy = column => {
  const compute = nest()
    .key(d => d[column])
    .key(d => d.year)
    .rollup(values => sum(values, d => d.value));
  return data => compute.entries(data);
};

const computeByYears = nest()
  .key(d => d.year)
  .rollup(values => sum(values, d => d.value));
export const aggregateByYears = (data) => {
  const entries = computeByYears.entries(data);

  // Parse years (keys here) into Date objects.
  entries.forEach(entry => {
    entry.date = new Date(entry.key);
  });

  return entries;
};
