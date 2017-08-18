const TimePanel = g => (box, margin) => {
  const rect = g.selectAll('rect').data([1]);
  const rectEnter = rect.enter().append('rect')
      .attr('fill', 'gray');
  rect.merge(rectEnter)
      .attr('x', box.x)
      .attr('y', box.y)
      .attr('width', box.width)
      .attr('height', box.height);

  const innerWidth = box.width - margin.right - margin.left;
  const innerHeight = box.height - margin.top - margin.bottom;

  const marginRect = g.selectAll('.margin-rect').data([1]);
  const marginRectEnter = marginRect.enter().append('rect')
      .attr('fill', 'black')
      .attr('class', 'margin-rect');
  marginRect.merge(marginRectEnter)
      .attr('x', box.x + margin.left)
      .attr('y', box.y + margin.top)
      .attr('width', innerWidth)
      .attr('height', innerHeight);
};

export default TimePanel;
