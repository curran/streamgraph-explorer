import computeLayout from 'chiasm-layout/src/computeLayout';

// The way that the components are to be arranged.
const arrangement = {
  orientation: 'vertical',
  children: [ 'srcStream', 'destStream' ]
};

// Set up the layout that responds to resize.
const layout = (container, dataFlow) => {

  // This function returns the container dimensions.
  const containerBox = () => ({
    width: container.clientWidth,
    height: container.clientHeight
  });

  // Compute the layout on resize.
  const resize = () => {
    const box = containerBox();
    const computedLayout = computeLayout(arrangement, {}, box);

    dataFlow.containerBox(box);

    // Pass computed boxes into the data flow graph.
    // e.g. 'srcStreamBox', 'destStreamBox', ...
    Object.keys(computedLayout).forEach(key => {
      dataFlow[key + 'Box'](computedLayout[key]);
    });
  };
  resize();
  window.addEventListener('resize', resize);
};

export default layout;
