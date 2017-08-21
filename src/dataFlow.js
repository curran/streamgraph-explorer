import { extent } from 'd3-array';
import ReactiveModel from 'reactive-model';
import unpackData from './unpackData';
import { aggregateBy, aggregateByYears } from './aggregateBy';
import interpolate from './interpolate';
import keys from './keys';
import hashRouting from './hashRouting';

const dataFlow = ReactiveModel();

// Declare reactive properties used as inputs.
dataFlow
  ('packedData') // The data loaded directly from JSON.
  ('containerBox') // Dimensions of the container DIV.
  ('srcStreamBox') // Position and dimensions of the source StreamGraph.
  ('destStreamBox') // Position and dimensions of the destination StreamGraph.
  ('timePanelBox') // Position and dimensions of the time panel.
  ('contextStreamBox') // Position and dimensions of the context panel.
  ('src', null) // The currently selected source (null means no selection).
  ('dest', null) // The currently selected destination (null means no selection).
  ('maxStreamLayers', 50) // The maximum number of layers in a StreamGraph.
  ('minStreamMax', 100) // Layers with maxima below this are excluded.
  ('streamsMargin', { // The margin of the StreamGraphs and TimePanel.
    top: 0, bottom: 0, left: 20, right: 20
  })
  ('allYears') // The array of all years as Date objects.
  ('timeExtent') // The full extent of time from the data.
  ('zoomExtent') // The time extent of the zoomed region.
;

// Reactive functions.
dataFlow('data', unpackData, 'packedData');

// TODO filter by selected types
dataFlow('dataFiltered', (data, src, dest) => {
  data = src ? data.filter(d => d.src === src) : data;
  return dest ? data.filter(d => d.dest === dest) : data;
}, 'data, src, dest');

// Compute aggregated data by source and destination (after filtering).
dataFlow('dataBySrc', aggregateBy('src'), 'dataFiltered');
dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

//dataFlow('dataByDest', aggregateBy('dest'), 'dataFiltered');

// Compute data for context panel, aggregated by only time.
dataFlow('dataByYear', aggregateByYears, 'dataFiltered');

// Compute keys, top N (maxStreamLayers) sorted by max value.
dataFlow('srcKeys', keys, 'dataBySrc, maxStreamLayers, minStreamMax');
dataFlow('destKeys', keys, 'dataByDest, maxStreamLayers, minStreamMax');

// Interpolate the aggregated data so there are values for all years.
dataFlow('srcStreamDataAllYears', interpolate, 'allYears, dataBySrc');
dataFlow('destStreamDataAllYears', interpolate, 'allYears, dataByDest');

// Compute the data filtered by zoomed region.
const zoomFilter = (data, zoomExtent) => {
  const min = zoomExtent[0];
  const max = zoomExtent[1];
  return data.filter(d => d.date > min && d.date < max);
};
dataFlow('srcStreamData', zoomFilter, 'srcStreamDataAllYears, zoomExtent');
dataFlow('destStreamData', zoomFilter, 'destStreamDataAllYears, zoomExtent');

// Initialize the routing system that uses URL hash
// to store pieces of the state.
hashRouting(dataFlow, ['src', 'dest']);

export default dataFlow;
