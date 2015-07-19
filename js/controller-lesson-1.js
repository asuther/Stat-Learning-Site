var g = new graph();

var pointsX = [100, 200,250,50, 60, 120];
var pointsY = [100, 170, 200,80,70, 120];

g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
g.drawReferencePoints([20,100],[30,50]);

var barGraph = new barGraph();
barGraph.drawBarGraph(30);

//Add mouse click info
var graphCanvas = g.getCanvas();

var updateRSS = function() {
    $('#totalRSS').text('Total RSS: ' + Math.round(currentRSS));

    if(currentRSS < minRSS) {
        minRSS = currentRSS;
        $('#minRSS').text('Min RSS: ' + Math.round(minRSS));
    }
};

var currentRSS = g.getRSS();
var minRSS = currentRSS;
updateRSS();

var mouseDown = false;

graphCanvas.mousedown(function(e) {
    g.mousedown(e);
    mouseDown = true;
})
.mouseup(function(e) {
    g.mouseup(e);
    mouseDown = false;
})
.mousemove(function(e) {
    if(mouseDown) {
        g.mousemove(e);
        currentRSS = g.getRSS();
        updateRSS();

        barGraph.drawBarGraph(currentRSS);
    }

});
