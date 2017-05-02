$(document).ready(function() {
  var w = 600,
    h = 350;
  var DELAY = 1000;
  var intervalFunction = null;

  function init() {
    clearInterval(intervalFunction, DELAY);
    var graph = new randomGraphGenerator(40,350,600,15);
    var graphProblem = new bidirectionalProblem(graph);
    var options = new DefaultOptions();
    options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)';
    var graphDrawAgent = new GraphDrawAgent(graphProblem.mergedProblem, 'bibreadthFirstSearchCanvas', options, h, w);
    //Update handler is the function that would be executed every DELAY ms.
    var updateFunction = function() {
      if (graphProblem.checkEndCondition()) {
        graphProblem.iterate();
        graphDrawAgent.iterate();
      } else {
        clearInterval(intervalFunction, DELAY);
      }
    }
    intervalFunction = setInterval(updateFunction, DELAY);
  };
  $('#bibfsRestartButton').click(init);
  init();
});
