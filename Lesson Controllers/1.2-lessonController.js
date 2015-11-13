var g = new graph('linearRegressionGraph');
var linearRegressionModel = new LinearRegressionModel();
g.addObserver(linearRegressionModel);

var pointsX = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
var pointsY = [105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175];
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

$('#calculatePValue').click(function() {
    $.post( "PythonAjax/calculatePValue.cgi", {SEBeta: linearRegressionModel.calculateSEBeta(), beta: linearRegressionModel.calculateBeta()}, function( data ) {
        console.log(data);
    });
});
