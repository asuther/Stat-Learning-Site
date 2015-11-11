var g = new graph();

var pointsX = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300];
var pointsY = [5.323169, 32.116875, 37.512964, 18.827295, 35.767723, 8.126310, 88.338183, 56.471593, 82.898370, 110.501148, 133.672267, 129.001325, 137.316908, 153.702134, 142.017148];
var currentRSS;
var beta;

g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
g.drawReferencePoints([20,100],[30,50]);

//Custom Functions for lesson
function calculateBeta() {
  referencePoints = g.getReferencePoints();
    beta = ( referencePoints[1][1] - referencePoints[0][1] ) / ( referencePoints[1][0] - referencePoints[0][0] );
    $('#betaValue').text(beta.toFixed(2));
};
function calculateSEBeta() {
    $('#SEValue').text(Math.sqrt(currentRSS / (13 * beta)).toFixed(1));
};

var updateRSS = function() {
    currentRSS = g.getRSS();
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
        calculateBeta();
        updateRSS();
        calculateSEBeta();
    } else {
        g.mousemoveNoClick(e);
    }

});
