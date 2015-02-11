var g = new graph();
var pointsX = [100, 200,250,50, 60, 120];
var pointsY = [100, 170, 200,80,70, 120];
g.drawAxes();
g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
g.drawReferencePoints([20,100],[30,50]);

var barGraph = new barGraph();
barGraph.drawBarGraph(30);

//Add mouse click info
var graphCanvas = g.getCanvas();
graphCanvas.mousedown(function(e) {
    g.mousedown(e);
})
.mouseup(function(e) {
    g.mouseup(e);
})
.mousemove(function(e) {
    g.mousemove(e);
    currentRSS = g.getRSS();
    barGraph.drawBarGraph(currentRSS);
});
