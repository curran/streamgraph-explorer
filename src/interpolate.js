import { bisector } from 'd3-array';

const bisectDate = bisector(d => d.date).left;

// This function doesn't actually perform any interpolation.
// It returns zero if the value is not defined in the data.
const interpolateValue = (values, date) => {
  const i = bisectDate(values, date, 0, values.length - 1);
  const closestDatum = values[i];

  // If a value for the desired date is not present in the data,
  if (date.getTime() !== closestDatum.date.getTime()) {
    return 0;
  }

  return closestDatum.value;
};

// Interpolate values, create data structure for d3.stack.
export const interpolate = (years, nestedData) => {

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
      // TODO optimize: if d.key in keys...
      row[d.key] = interpolateValue(d.values, date);
    });

    return row;
  });
};

export const interpolateTotals = (years, data) => {
  return years.map(date => {

    // Create a new row object with the date.
    const row = { date };

    data.forEach(d => {
      row.value = interpolateValue(data, date);
    });

    return row;
  });
};
