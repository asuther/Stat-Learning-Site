function graph() {

    var leftOffset = 50;
    var graphHeight = 300;
    var graphWidth = 300;
    var pointSize = 4;
    var pointsX = [];
    var pointsY = [];

    var referencePointsX = [];
    var referencePointsY = [];

    var canvas = $('#graph');
    var context = canvas.get(0).getContext('2d');

    var lineStats = {
        m: 0,
        b: 0
    };

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
        //Store points
        this.pointsX = pointsX;
        this.pointsY = pointsY;
    };

    this.drawReferencePoints = function(pointsX, pointsY) {
        if(pointsX.length != 2 || pointsX.length != pointsY.length) {
            return;
        }
        referencePointsX = pointsX;
        referencePointsY = pointsY;
        //Draw first point
        context.beginPath();
        context.arc(pointsX[0] + leftOffset, graphHeight - pointsY[0], pointSize, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
        context.arc(pointsX[1] + leftOffset, graphHeight - pointsY[1], pointSize, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
       // context.fillOval(pointsX[1] + leftOffset - pointSize, graphHeight - pointsY[1] - pointSize, pointSize*2, pointSize*2);
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
            lineStats.m = ( pointsY[ pointsArrayLength - 1 ] - pointsY[ pointsArrayLength - 2 ] ) / ( pointsX[ pointsArrayLength - 1] - pointsX[ pointsArrayLength - 2 ]);
            lineStats.b = pointsY[0] - lineStats.m * pointsX[0];
            context.moveTo(0 + leftOffset,graphHeight - lineStats.b);
        } else {
            context.moveTo(pointsX[0]+ leftOffset,graphHeight - pointsY[0]);
        }

        for (var index = 1; index < pointsX.length ; index++ ) {
            context.lineTo(pointsX[index]+ leftOffset, graphHeight - pointsY[index]);
        }

        if(extrapolate) {
            finalY = lineStats.m  * ( graphWidth ) + lineStats.b;
            context.lineTo(graphWidth + leftOffset, graphHeight - finalY);
        }
        context.stroke();
    };


    this.getRSS = function() {
        var RSS = 0;
        context.strokeStyle = '#FF0000';
        for (var index = 0 ; index < this.pointsX.length ; index++ ) {
            predictedY = lineStats.m * this.pointsX[index] + lineStats.b;
            squaredResidual = Math.pow(predictedY - this.pointsY[index], 2);
            console.log('Predicted Y: ' + predictedY);
            console.log('Actual Y: ' + this.pointsY[index]);
            console.log('Sq Res: ' + squaredResidual);
            RSS += squaredResidual;

            context.beginPath();
            context.moveTo(this.pointsX[index] + leftOffset + 2, graphHeight - this.pointsY[index]);
            context.lineTo(this.pointsX[index] + leftOffset + 2, graphHeight - predictedY);
            context.strokeStyle = '#FF0000';
            context.stroke();
            context.font = '9pt Calibri';
            context.fillText(squaredResidual, this.pointsX[index] + leftOffset + 5, graphHeight - (this.pointsY[index] + (predictedY - this.pointsY[index])/2) + 5)
        }
        return RSS;
    };

    //Add mouse click info
    canvas.click(function(e) {
        console.log(e.pageY);
        //calculated distance from
    });
}

var g = new graph();
var pointsX = [100,200,250,50];
var pointsY = [100,50,200,150];
g.drawAxes();
g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
g.drawReferencePoints([20,100],[30,50]);
console.log(g.getRSS());





