import { component } from 'd3-component';

const rect = component('rect')
  .render((selection, d) => {
    selection
        .attr('width', d.width)
        .attr('height', d.height)
        .attr('fill', 'gray')
        .attr('stroke', 'black')
        .attr('stroke-width', 3);
  });

const StreamGraph = component('g')
  .render((selection, d) => {
    selection.call(rect, d.box);
  });

export default StreamGraph;
