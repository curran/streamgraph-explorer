import { area, curveBasis } from 'd3-shape';
import { scaleTime, scaleLinear } from 'd3-scale';
import { min, max, extent, range } from 'd3-array';

const xValue = d => d.date;
const yValue = d => d.value;

const xScale = scaleTime();
const yScale = scaleLinear();

const contextArea = area()
  .x(d => xScale(xValue(d)))
  .y0(d => yScale.range()[1] - yScale(yValue(d)))
  .y1(d => yScale.range()[1] + yScale(yValue(d)))
  .curve(curveBasis);

const ContextStream = (selection, props) => {
  const {
    box: { width, height },
    data,
  } = props;

  xScale
    .domain(extent(data, xValue))
    .range([0, width]);

  yScale
    .domain(extent(data, yValue))
    .range([0, height / 2]);

  // Render the area for the ContextStream.
  const paths = selection
    .selectAll('.context-panel-area').data([data]);
  const pathsEnter = paths
    .enter().append('path')
      .attr('class', 'context-panel-area');
  pathsEnter
    .merge(paths)
      .attr('fill', 'black') // TODO make this configurable
      .attr('d', contextArea)
  paths.exit().remove();
};

export default ContextStream;
