import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';

const xScale = scaleTime();
const xAxis = axisBottom()
  .scale(xScale)
  .tickSize(0)
  .tickPadding(-3);

const TimePanel = g => (box, margin, timeExtent) => {
  const innerWidth = box.width - margin.right - margin.left;

  xScale
    .domain(timeExtent)
    .range([0, innerWidth]);
  
  const translateX = box.x + margin.left;
  const translateY = box.y + box.height / 2;
  g
      .attr('transform', `translate(${translateX},${translateY})`)
      .call(xAxis);
};

export default TimePanel;
