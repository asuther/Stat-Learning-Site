function graph() {

    var leftOffset = 50;
    var graphHeight = 300;
    var graphWidth = 300;
    var pointSize = 3;

    var context = $('#graph').get(0).getContext('2d');

    this.drawAxes = function() {
        context.beginPath();
        context.moveTo(leftOffset, 0);
        context.lineTo(leftOffset, graphHeight);
        context.lineTo(graphWidth+leftOffset, graphHeight);
        context.stroke();
    };

    this.drawPoints = function(pointsX, pointsY) {
        //If the arrays are not the same length, exit
        if(pointsX.length != pointsY.length) {
            return;
        }
        for (var index = 0; index < pointsX.length ; index++ ) {
            context.fillRect(pointsX[index] + leftOffset, graphHeight - pointsY[index], pointSize, pointSize);
        }
    };
}

var g = new graph();
var pointsX = [100,200,100,50];
var pointsY = [100,50,200,150];
g.drawAxes();
g.drawPoints(pointsX, pointsY);

