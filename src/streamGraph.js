import { area, curveBasis, stack, stackOffsetWiggle, stackOrderInsideOut } from 'd3-shape';
import { scaleTime, scaleLinear, scaleOrdinal, schemeCategory10 } from 'd3-scale';
import { min, max, extent, range } from 'd3-array';
import { areaLabel } from 'd3-area-label';

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

const streamLabel = areaLabel(streamArea)
  .interpolateResolution(1000);

const margin = { top: 0, bottom: 0, left: 0, right: 0 };

const StreamGraph = (selection, props) => {
  const {
    box,
    data,
    keys,
    onAreaClick,
    title
  } = props;

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

  // Render the areas for the StreamGraph layers.
  const paths = selection
    .selectAll('.streamgraph-area').data(stacked);
  const pathsEnter = paths
    .enter().append('path')
      .attr('class', 'streamgraph-area');
  pathsEnter
    .merge(paths)
      .attr('fill', d => colorScale(d.index))
      .attr('stroke', d => colorScale(d.index))
      .attr('d', streamArea)
      .on('click', d => onAreaClick(stacked.length === 1 ? null : d.key));
  paths.exit().remove();

  // Add <title> tags to each area for simple tooltips that show names on hover.
  paths.select('title')
    .merge(pathsEnter.append('title'))
      .text(d => d.key);

  // Add the labels on top of the areas.
  const labels = selection
    .selectAll('.streamgraph-area-label').data(stacked);
  const labelsEnter = labels
    .enter().append('text')
      .attr('class', 'streamgraph-area-label');
  labelsEnter
    .merge(labels)
      .text(d => d.key)
      .attr('transform', streamLabel)
  labels.exit().remove();

  // Add the title.
  const titleText = selection
    .selectAll('.streamgraph-title').data([1]);
  titleText
    .enter().append('text')
      .attr('class', 'streamgraph-title')
    .merge(titleText)
      .attr('x', innerWidth * 0.02)
      .attr('y', innerHeight * 0.3)
      .text(title + (stacked.length > 1 ? 's' : ''));
  console.log(title + (stacked.length > 1 ? 's' : ''));
};

export default StreamGraph;
