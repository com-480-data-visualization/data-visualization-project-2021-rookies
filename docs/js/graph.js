var nodes_var

fetch("../js/nodes.json", {
  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin':'*'
  }
})
.then(data => data.json())
.then(json => {
  nodes_var = json
  init_graph(nodes_var)
})
var cy
function init_graph(nodes_data) {
  cy = cytoscape({

    container: document.getElementById('cy'), // container to render in
  
    elements: // list of graph elements to start with
      nodes_data,
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
  
    layout: {
      name: 'grid',
      rows: 1
    },
  
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: 'single',
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
  
    // rendering options:
    headless: false,
    styleEnabled: true,
    hideEdgesOnViewport: false,
    textureOnViewport: false,
    motionBlur: false,
    motionBlurOpacity: 0.2,
    wheelSensitivity: 0.2,
    pixelRatio: 'auto'
  
  
  });
}
