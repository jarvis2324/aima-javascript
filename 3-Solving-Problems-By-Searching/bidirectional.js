function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
};
var bidirectionalProblem = function(graph) {
  this.sourceGraph = clone(graph);
  console.log(graph);
  this.destGraph = clone(graph);
  this.sourceProblem = new GraphProblem(this.sourceGraph.nodes,this.sourceGraph.edges,1);
  this.destProblem = new GraphProblem(this.destGraph.nodes,this.destGraph.edges,5);
  this.sourceAgent = new GraphAgent(this.sourceProblem);
  this.destAgent = new GraphAgent(this.destProblem);

  this.mergedGraph = clone(graph);
  this.mergedProblem = new GraphProblem(this.mergedGraph.nodes,this.mergedGraph.edges,1);
  this.overlap = false;
  this.checkEndCondition = function() {
    return !this.overlap;
  };

  this.mergeBFS = function() {
    let nodeDict = this.sourceProblem.nodes;
    for(nodeKey in nodeDict) {
      if(this.sourceProblem.nodes[nodeKey].state == 'explored' ||
      this.destProblem.nodes[nodeKey].state == 'explored') {
        this.mergedProblem.nodes[nodeKey].state = 'explored';
      } else {

        if(this.sourceProblem.nodes[nodeKey].state == 'frontier' ||
        this.destProblem.nodes[nodeKey].state == 'frontier') {
          this.mergedProblem.nodes[nodeKey].state = 'frontier';
        } else {
          this.mergedProblem.nodes[nodeKey].state = 'unexplored';
        }
      }
    }
  }
  this.iterate = function() {
    let sourceNext = breadthFirstSearch(this.sourceProblem);
    let destNext = breadthFirstSearch(this.destProblem);

    this.destAgent.expand(destNext);
    this.sourceAgent.expand(sourceNext);
    this.mergeBFS();

    if(this.sourceProblem.nodes[destNext].state == 'explored' &&
      this.destProblem.nodes[sourceNext].state == 'explored') {
      this.overlap = true;
    }
  }
  this.mergeBFS();
};
