$(document).ready(function() {
  var w = 600,
    h = 350;
  var DELAY = 500;
  var LIMIT = 2;
  var intervalFunction = null;

  function init() {
    //Cut off limit of Depth
    LIMIT = $('#limitSelector').val();
    clearInterval(intervalFunction, DELAY);
    var graph = new DLSGraph();
    var graphProblem = new GraphProblem(graph.nodes, graph.edges, 'A', null);
    var graphAgent = new GraphAgent(graphProblem);
    var options = new DefaultOptions();
    var graphDrawAgent = new GraphDrawAgent(graphProblem, 'depthLimitedSearchCanvas', options, h, w);
    drawDepthOnEdges();
    var updateFunction = function() {
      if (graphProblem.frontier.length > 0) {
        var nextNode = depthLimitedSearch(graphProblem, LIMIT);
        if (nextNode != null) {
          graphAgent.expand(nextNode);
          graphDrawAgent.iterate();
          iterateDepthsOnEdges();
        }
      } else {
        clearInterval(intervalFunction, DELAY);
        console.log(graphProblem.nodes);
      }
    }
    intervalFunction = setInterval(updateFunction, DELAY);

    function drawDepthOnEdges() {
      // Draws the depth over the edges (where costs are drawn in case of UCS)
      // It is called once to draw the depths
      graphDrawAgent.depths = [];
      let edges = graphDrawAgent.edges;
      for (let i = 0; i < edges.length; i++) {
        let node1Key = $(edges[i]._renderer.elem).attr('node1');
        let node2Key = $(edges[i]._renderer.elem).attr('node2');
        let node1 = graphProblem.nodes[node1Key];
        let node2 = graphProblem.nodes[node2Key];
        let coords = getEdgeCostLocation(node1.x, node1.y, node2.x, node2.y);
        let text = graphDrawAgent.two.makeText(0, coords.x, coords.y);
        text.opacity = 0;
        graphDrawAgent.two.update();
        $(text._renderer.elem).attr('node1', node1Key);
        $(text._renderer.elem).attr('node2', node2Key);
        graphDrawAgent.depths.push(text);
      }
    }

    function iterateDepthsOnEdges() {
      // It uses the already drawn depths and update it on every interval
      for (let i = 0; i < graphDrawAgent.depths.length; i++) {
        let text = graphDrawAgent.depths[i];
        let node1Key = $(text._renderer.elem).attr('node1');
        let node2Key = $(text._renderer.elem).attr('node2');
        let node1 = graphProblem.nodes[node1Key];
        let node2 = graphProblem.nodes[node2Key];
        if (node1.state == 'explored' && node2.state == 'explored') {
          let depth = Math.max(node1.depth, node2.depth);
          text.value = depth;
          text.opacity = 1;
        } else {
          text.opacity = 0;
        }
      }
      graphDrawAgent.two.update();
    }
  };
  $('#dlsRestartButton').click(init);
  //Restart the simulation when limit is changed
  $('#limitSelector').change(init);
  init();
  $('#limitSelector').on('input change', function () {
      $('#limitSelectorText').text($(this).val());
  });
});
