import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';

const xScale = scaleTime();
const xAxis = axisBottom().scale(xScale);

const TimePanel = g => (box, margin, timeExtent) => {
  const innerWidth = box.width - margin.right - margin.left;
  const innerHeight = box.height - margin.top - margin.bottom;

  xScale
    .domain(timeExtent)
    .range([0, innerWidth]);
  
  const translateX = box.x + margin.left;
  const translateY = box.y + margin.top;
  g
      .attr('transform', `translate(${translateX},${translateY})`)
      .call(xAxis);
};

export default TimePanel;
