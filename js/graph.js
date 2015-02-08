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

    this.drawLine = function(pointsX,pointsY, extrapolate) {

        extrapolate = extrapolate || false;
        var pointsArrayLength = pointsX.length;
        //the arrays must match in size and there must be at least two points
        if(pointsX.length != pointsY.length || pointsArrayLength < 2) {
            return;
        }
        context.beginPath();
        if(extrapolate) {
            //Determine y = mx + b
            m = ( pointsY[ pointsArrayLength - 1 ] - pointsY[ pointsArrayLength - 2 ] ) / ( pointsX[ pointsArrayLength - 1] - pointsX[ pointsArrayLength - 2 ]);
            b = pointsY[0] - m * pointsX[0];
            context.moveTo(0 + leftOffset,graphHeight - b);
        } else {
            context.moveTo(pointsX[0]+ leftOffset,graphHeight - pointsY[0]);
        }

        for (var index = 1; index < pointsX.length ; index++ ) {
            context.lineTo(pointsX[index]+ leftOffset, graphHeight - pointsY[index]);
        }

        if(extrapolate) {
            finalY = m * ( graphWidth ) + b;
            context.lineTo(graphWidth + leftOffset, graphHeight - finalY);
        }
        context.stroke();
    };
}

var g = new graph();
var pointsX = [100,200,100,50];
var pointsY = [100,50,200,150];
g.drawAxes();
g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
