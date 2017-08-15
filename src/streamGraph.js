import { area, curveBasis, stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { min, max, extent, range } from 'd3-array';

const xValue = d => d.date;
const xScale = scaleTime();
const yScale = scaleLinear();
const colorScale = scaleOrdinal().range(schemeCategory10);
const streamStack = stack().offset(stackOffsetWiggle).order(stackOrderInsideOut);

const streamArea = area()
  .x(d => xScale(xValue(d.data)))
  .y0(d => yScale(d[0]))
  .y1(d => yScale(d[1]))
  .curve(curveBasis);

const margin = { top: 0, bottom: 30, left: 0, right: 30 };

const StreamGraph = (selection, props) => {
  const { box, data, keys, onAreaClick } = props;
  const innerWidth = box.width - margin.right - margin.left;
  const innerHeight = box.height - margin.top - margin.bottom;

  const stacked = streamStack.keys(keys)(data);

  xScale
    .domain(extent(data, xValue))
    .range([0, innerWidth]);

  yScale
    .domain([
      min(stacked, series => min(series, d => d[0])),
      max(stacked, series => max(series, d => d[1]))
    ])
    .range([innerHeight, 0]);

  colorScale.domain(range(keys.length));

  const singleLayer = stacked.length === 1;

  const paths = selection.selectAll('path').data(stacked);
  const pathsEnter = paths.enter().append('path');
  pathsEnter
    .merge(paths)
      .attr('fill', d => colorScale(d.index))
      .attr('stroke', d => colorScale(d.index))
      .attr('d', streamArea)
      .on('click', d => onAreaClick(singleLayer ? null : d.key));
  paths.exit().remove();

  paths.select('title')
    .merge(pathsEnter.append('title'))
      .text(d => d.key);
};

export default StreamGraph;
