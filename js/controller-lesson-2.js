var g = new graph('linearRegressionGraph');
var linearRegressionModel = new LinearRegressionModel();
g.addDependency(linearRegressionModel);

var pointsX = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
var pointsY = [5.323169, 32.116875, 37.512964, 18.827295, 35.767723, 8.126310, 88.338183, 56.471593, 82.898370, 110.501148, 133.672267, 129.001325, 137.316908, 153.702134, 142.017148];
var currentRSS;
var beta;

g.setPoints(pointsX, pointsY);
g.update();


var updateRSS = function() {
    currentRSS = linearRegressionModel.getRSS();
    $('#totalRSS').text(Math.round(currentRSS));

};



//When the showRSS checkbox is checked, update the graph
$('#showRSS').change(function(e) {
    g.update();
});

//Add mouse click info
var graphCanvas = g.getCanvas();

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
        updateRSS();
        beta = linearRegressionModel.calculateBeta();
        $('#betaValue').text(beta.toFixed(2));
        $('#SEValue').text(linearRegressionModel.calculateSEBeta());
    } else {
        g.mousemoveNoClick(e);
    }

});
