import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';

const xScale = scaleTime();
const xAxis = axisBottom()
  .scale(xScale)
  .tickSize(0)
  .tickPadding(-3);

const TimePanel = g => (box, margin, timeExtent, ticksYExtent) => {
  const innerWidth = box.width - margin.right - margin.left;

  xScale
    .domain(timeExtent)
    .range([0, innerWidth]);
  
  const translateX = box.x + margin.left;
  const translateY = box.y + box.height / 2;
  g
      .attr('class', 'time-panel-axis')
      .attr('transform', `translate(${translateX},${translateY})`)
      .call(xAxis);
  g.select('.domain').remove();
  console.log(translateY);
  g.selectAll('.tick line')
      .attr('y1', ticksYExtent.y1 - translateY)
      .attr('y2', ticksYExtent.y2 - translateY);
};

export default TimePanel;
