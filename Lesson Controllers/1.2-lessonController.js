var g = new graph('linearRegressionGraph');
var linearRegressionModel = new LinearRegressionModel();
g.addObserver(linearRegressionModel);

var pointsX = [20, 60, 100, 140, 180, 220, 260, 300];
var pointsY = [145, 95, 165, 75, 185, 125, 195, 155];
//var pointsY = [105, 115, 125, 135, 145, 155, 165, 175];
var currentRSS;
var beta;

g.setPoints(pointsX, pointsY);
linearRegressionModel.disableReferencePoints(true, true);
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

    } else {
        g.mousemoveNoClick(e);
    }

});

$('#calculatePValue').click(function() {
    $.post( "PythonAjax/calculatePValue.cgi", {SEBeta: linearRegressionModel.calculateSEBeta(), beta: linearRegressionModel.calculateBeta()}, function( pValue ) {

        console.log(pValue);
        console.log(pValue.length);
        if( pValue.length <= 1) {
            pValue = 0;
        }
        pValue = parseFloat(pValue)
        $('#pValue').text(pValue.toFixed(4));

        checkWin(pValue);
    });
});


//Slider
$('#varianceSlider').on('input', function() {
    $('#varianceSliderValue').text(this.value);
    linearRegressionModel.addVarianceToPoints(this.value);
    g.update();
    updateRSS();
    beta = linearRegressionModel.calculateBeta();
    $('#xVariance').text(linearRegressionModel.xVariance.toFixed(2));
    $('.SEValue').text(linearRegressionModel.calculateSEBeta());
    $('#betaValue').text(linearRegressionModel.calculateBeta().toFixed(2));
    betaVal = $('#betaValue');
    $('#tValue').text((parseFloat($('#betaValue')[0].innerHTML) / parseFloat($('.SEValue')[0].innerHTML)).toFixed(2));
});

function checkWin(pValue) {
    if (pValue < 0.001) {
        console.log('checking win');
        $('#nextButton').show();
    }
}
