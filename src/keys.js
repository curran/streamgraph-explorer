import { max, descending } from 'd3-array';

const keys = (nestedData, maxStreamLayers, minStreamMax) => {
  return nestedData
    .map(d => ({
      key: d.key,
      max: max(d.values, d => d.value)
    }))
    .filter(d => d.max > minStreamMax) // Filter out tiny streams
    .sort((a, b) => descending(a.max, b.max))
    .slice(0, maxStreamLayers)
    .map(d => d.key);
};
export default keys;
