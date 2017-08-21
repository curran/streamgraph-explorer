import { timeFormat, timeParse } from 'd3-time-format';
import queryString from 'query-string';

const zoomFormatStr = '%Y';
const zoomFormat = timeFormat(zoomFormatStr);
const zoomParse = timeParse(zoomFormatStr);
const zoomSplitStr = '-';

const encodeZoom = zoomExtent => {
  return zoomExtent.map(zoomFormat).join(zoomSplitStr);
};
const decodeZoom = zoomStr => {
  return zoomStr.split(zoomSplitStr).map(zoomParse);
};

const hashRouting = (dataFlow, stateParams) => {

  // Update the URL hash based on src and dest.
  dataFlow(function (src, dest, zoomExtent) {
    const params = {
      src,
      dest,
      zoom: encodeZoom(zoomExtent)
    };
    const hash = queryString.stringify(params);
    window.location.hash = hash;
  }, stateParams);

  // On page load, pass the state encoded in the URL
  // into the data flow graph.
  const hash = window.location.hash.substr(1);
  if (hash.length > 0) {
    const params = queryString.parse(hash);
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (key === 'zoom') {
        dataFlow.zoomExtent(decodeZoom(value));
      } else {
        dataFlow[key](value);
      }
    });
  }
};
export default hashRouting;
