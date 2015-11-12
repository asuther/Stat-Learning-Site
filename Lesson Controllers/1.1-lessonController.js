var scatterPlot = new graph('linearRegressionGraph');
var linearRegressionModel = new LinearRegressionModel();
//var costFunctionController = new costFunctionController();

scatterPlot.addObserver(linearRegressionModel);

var pointsX = [100, 200,250,50, 60, 120];
var pointsY = [100, 170, 200,80,70, 120];

scatterPlot.setPoints(pointsX, pointsY);
scatterPlot.update();

var barGraph = new barGraph();
barGraph.drawBarGraph(30);

//Add mouse click info
var graphCanvas = scatterPlot.getCanvas();

var updateRSS = function() {
    $('#totalRSS').text('Current RSS: ' + Math.round(currentRSS));

    if(currentRSS < minRSS) {
        minRSS = currentRSS;
        $('#minRSS').text('Min RSS: ' + Math.round(minRSS));
    }
};
$('#showRSS').change(function(e) {
    scatterPlot.update();
});

var currentRSS = linearRegressionModel.getRSS();
var minRSS = currentRSS;
updateRSS();

var mouseDown = false;

graphCanvas.mousedown(function(e) {
    scatterPlot.mousedown(e);
    mouseDown = true;
})
.mouseup(function(e) {
    scatterPlot.mouseup(e);
    mouseDown = false;
})
.mousemove(function(e) {
    if(mouseDown) {
        scatterPlot.mousemove(e);
        currentRSS = linearRegressionModel.getRSS();
        updateRSS();

        barGraph.drawBarGraph(currentRSS);
    } else {
        scatterPlot.mousemoveNoClick(e);
    }

});
$('#nextButton').hide();
$('#submitButton').click(function(e) {
    var currentRSS = linearRegressionModel.getRSS();

    if(currentRSS < 200) {
        $('#submitText').text('Great!')
        $('#nextButton').show();
    } else {
        $('#submitText').text('The RSS can be minimized more than that!')

    }
});
