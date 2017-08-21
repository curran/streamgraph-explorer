import { event } from 'd3-selection';
import { area, curveBasis } from 'd3-shape';
import { scaleTime, scaleLinear } from 'd3-scale';
import { min, max, extent, range } from 'd3-array';
import { brushX } from 'd3-brush';

const xValue = d => d.date;
const yValue = d => d.value;

const xScale = scaleTime();
const yScale = scaleLinear();

const contextArea = area()
  .x(d => xScale(xValue(d)))
  .y0(d => yScale.range()[1] - yScale(yValue(d)))
  .y1(d => yScale.range()[1] + yScale(yValue(d)))
  .curve(curveBasis);

const contextBrush = brushX();

const ContextStream = (selection, props) => {
  const {
    box: { width, height },
    data,
    onBrush,
    onBrushStart,
    onBrushEnd,
    timeExtent
  } = props;

  xScale
    .domain(timeExtent)
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

  // Set up the brush.
  contextBrush
    .on('start', onBrushStart)
    .on('brush', () => {
      onBrush(event.selection.map(xScale.invert));
    })
    .on('end', () => {
      onBrushEnd();
      if (!event.selection) {
        // Reset the zoom region to all years
        // when the brush is cleared.
        onBrush(xScale.domain());
      }
    });
  const brushG = selection
    .selectAll('.brush').data([null]);
  brushG
    .enter().append('g')
      .attr('class', 'brush')
    .merge(brushG)
      .call(contextBrush);
};

export default ContextStream;
