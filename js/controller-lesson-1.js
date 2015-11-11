var g = new graph('linearRegressionGraph');
var linearRegressionModel = new LinearRegressionModel();

g.addDependency(linearRegressionModel);
var pointsX = [100, 200,250,50, 60, 120];
var pointsY = [100, 170, 200,80,70, 120];

g.setPoints(pointsX, pointsY);
g.update();
//linearRegressionModel.drawLine([20,100],[30,50], true);
//linearRegressionModel.drawReferencePoints();

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

var currentRSS = linearRegressionModel.getRSS();
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
        currentRSS = linearRegressionModel.getRSS();
        updateRSS();

        barGraph.drawBarGraph(currentRSS);
    } else {
        g.mousemoveNoClick(e);
    }

});
