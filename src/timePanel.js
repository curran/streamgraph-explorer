const TimePanel = g => box => {
  const rect = g.selectAll('rect').data([1]);
  const rectEnter = rect.enter().append('rect')
      .attr('fill', 'gray');
  rect.merge(rectEnter)
      .attr('x', box.x)
      .attr('y', box.y)
      .attr('width', box.width)
      .attr('height', box.height);
};

export default TimePanel;
