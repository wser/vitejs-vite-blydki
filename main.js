const Graph = ForceGraph3D()(document.getElementById('3d-graph'));

let curDataSetIdx,
  numDim = 2; // 1,2,3

const dataSets = getGraphDataSets();

let toggleData;
(toggleData = function () {
  curDataSetIdx =
    curDataSetIdx === undefined ? 0 : (curDataSetIdx + 1) % dataSets.length;

  const dataSet = dataSets[curDataSetIdx];
  document.getElementById('graph-data-description').innerHTML =
    dataSet.description ? `Viewing ${dataSet.description}` : '';

  dataSet(Graph.resetProps().enableNodeDrag(true).numDimensions(numDim));
})(); // IIFE init

const toggleDimensions = function (numDimensions) {
  numDim = numDimensions;
  Graph.numDimensions(numDim);
};
