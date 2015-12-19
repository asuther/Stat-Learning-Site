var logisticPlot = new graph('logisticRegressionGraph', true);
var linearRegressionModel = new LinearRegressionModel();
//var costFunctionController = new costFunctionController();

logisticPlot.addObserver(linearRegressionModel);

var pointsX = [100, 200, 250, 50, 60, 120];
var pointsY = [0,   1,   1, 0,0, 1];

logisticPlot.setPoints(pointsX, pointsY);
logisticPlot.update();

//Add mouse click info
var graphCanvas = logisticPlot.getCanvas();

var updateRSS = function() {
    $('#totalRSS').text('Current RSS: ' + Math.round(currentRSS));

    if(currentRSS < minRSS) {
        minRSS = currentRSS;
        $('#minRSS').text('Min RSS: ' + Math.round(minRSS));
    }
};
$('#showRSS').change(function(e) {
    logisticPlot.update();
});

var currentRSS = linearRegressionModel.getRSS();
var minRSS = currentRSS;
updateRSS();

var mouseDown = false;

graphCanvas.mousedown(function(e) {
    logisticPlot.mousedown(e);
    mouseDown = true;
})
.mouseup(function(e) {
    logisticPlot.mouseup(e);
    mouseDown = false;
})
.mousemove(function(e) {
    if(mouseDown) {
        logisticPlot.mousemove(e);
        currentRSS = linearRegressionModel.getRSS();
        updateRSS();

        barGraph.drawBarGraph(currentRSS);
    } else {
        logisticPlot.mousemoveNoClick(e);
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
