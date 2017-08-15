import { bisector } from 'd3-array';
import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import aggregateBy from './aggregateBy';

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

const bisectDate = bisector(d => d.date).left;
const value = d => d.value;

const getInterpolatedValue = (values, date) => {
  const i = bisectDate(values, date, 0, values.length - 1);
  if (i > 0) {
    const a = values[i - 1];
    const b = values[i];
    const t = (date - a.date) / (b.date - a.date);
    return a.value * (1 - t) + b.value * t;
  }
  // TODO consider carefully on how to handle edge cases
  return values[i].value;
};

// Interpolate values, create data structure
// for d3.stack.
function interpolateValues (years, nestedData) {

  // Parse dates.
  var keys = nestedData.forEach(d => {
    d.values.forEach(d => {
      d.date = new Date(d.key);
    });
  });

  return years.map(function (date) {

    // Create a new row object with the date.
    const row = { date };


    // Assign values to the new row object for each key.
    // Value for `key` here will be country name.
    nestedData.forEach(d => {
      row[d.key] = getInterpolatedValue(d.values, date);
    });

    return row;
  });
}

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamData', interpolateValues, 'allYears, dataBySrc');
//dataFlow('destStreamData', interpolateAllYears, 'dataByDest');

dataFlow(d => console.log(d), 'srcStreamData');

export default dataFlow;
