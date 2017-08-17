const hashRouting = (dataFlow, stateParams) => {
  // Update the URL hash based on src and dest.
  dataFlow((src, dest) => {
    const params = {src, dest};
    const hash = JSON.stringify(params);
    window.location.hash = hash;
  }, stateParams);

  // On page load, pass the state encoded in the URL
  // into the data flow graph.
  const hash = window.location.hash.substr(1);
  if (hash.length > 0) {
    const params = JSON.parse(hash);
    Object.keys(params).forEach(key => {
      dataFlow[key](params[key]);
    });
  }
};
export default hashRouting;
