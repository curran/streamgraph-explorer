import { bisector } from 'd3-array';

const bisectDate = bisector(d => d.date).left;

const interpolateValue = (values, date) => {
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

// Interpolate values, create data structure for d3.stack.
const interpolate = (years, nestedData) => {

  // Parse dates.
  nestedData.forEach(d => {
    d.values.forEach(d => {
      d.date = new Date(d.key);
    });
  });

  return years.map(date => {

    // Create a new row object with the date.
    const row = { date };

    // Assign values to the new row object for each key.
    // Value for `key` here will be country name.
    nestedData.forEach(d => {
      row[d.key] = interpolateValue(d.values, date);
    });

    return row;
  });
};

export default interpolate;
