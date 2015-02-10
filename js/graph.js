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

    var isMouseDown = false;
    var that = this;
    var closestReferencePoint = 0;

    this.update= function() {

        context.fillStyle = 'white';
        context.fillRect(0,0,500,300);
        this.drawAxes();
        this.drawPoints(this.pointsX, this.pointsY);
        this.drawLine(referencePointsX,referencePointsY, true);
        this.drawReferencePoints(referencePointsX,referencePointsY);
        this.getRSS()
    };

    this.drawAxes = function() {
        context.strokeStyle = 'black';
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
        context.fillStyle = 'black';
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

        for (var referenceIndex = 0; referenceIndex < pointsX.length ; referenceIndex++ ) {
            context.beginPath();
            context.fillStyle = 'blue';
            if(referenceIndex == closestReferencePoint && isMouseDown){
                context.fillStyle = 'red';
            }


            context.arc(pointsX[referenceIndex] + leftOffset, graphHeight - pointsY[referenceIndex], pointSize, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
        }

       // context.fillOval(pointsX[1] + leftOffset - pointSize, graphHeight - pointsY[1] - pointSize, pointSize*2, pointSize*2);
    };

    this.drawLine = function(pointsX,pointsY, extrapolate) {

        extrapolate = extrapolate || false;
        var pointsArrayLength = pointsX.length;
        //the arrays must match in size and there must be at least two points
        if(pointsX.length != pointsY.length || pointsArrayLength < 2) {
            return;
        }
        context.strokeStyle = 'black';
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
            //console.log('Predicted Y: ' + predictedY);
            //console.log('Actual Y: ' + this.pointsY[index]);
            //console.log('Sq Res: ' + squaredResidual);
            RSS += squaredResidual;

            context.beginPath();
            context.moveTo(this.pointsX[index] + leftOffset + 2, graphHeight - this.pointsY[index]);
            context.lineTo(this.pointsX[index] + leftOffset + 2, graphHeight - predictedY);
            context.strokeStyle = '#FF0000';
            context.stroke();
            context.fillStyle = 'black';
            context.font = '9pt Calibri';
            context.fillText(Math.round(squaredResidual), this.pointsX[index] + leftOffset + 5, graphHeight - (this.pointsY[index] + (predictedY - this.pointsY[index])/2) + 5)
        }
        $('#totalRSS').text('Total RSS: ' + Math.round(RSS));
        return RSS;
    };

    this.getClosestReferencePoint = function(pageClickedX, pageClickedY, referencePointsX, referencePointsY) {
        var distances = [0,0];
        var shortestDistance = 2000000;
        var shortestDistanceIndex = -1;
        //console.log('(' + pageClickedX + ", " + pageClickedY + ')');
        clickedX = (pageClickedX - leftOffset);
        clickedY = (graphHeight - pageClickedY);
        //console.log('(' + clickedX + ", " + clickedY + ')');
        for (var index = 0; index < referencePointsX.length ; index++ ) {

            // context.beginPath();

            // context.moveTo(clickedX + leftOffset, graphHeight - clickedY);
            // context.lineTo(referencePointsX[index] + leftOffset, graphHeight - referencePointsY[index]);
            // context.strokeStyle = '#FF0000';
            // context.stroke();

            currentDistance = Math.sqrt(  Math.pow(clickedX - referencePointsX[index] , 2) + Math.pow(clickedY - referencePointsY[index], 2) );
            console.log(currentDistance);
            if(currentDistance < shortestDistance) {
                shortestDistance = currentDistance;
                shortestDistanceIndex = index;
            }
        }
        return shortestDistanceIndex;

    };
    //Add mouse click info
    canvas.mousedown(function(e) {
        console.log('keydown');
        isMouseDown = true;
        //calculated distance from

        closestReferencePoint = that.getClosestReferencePoint(e.pageX, e.pageY, referencePointsX, referencePointsY);
        console.log('Closest Ref Index: ' + closestReferencePoint);
    })
    .mouseup(function(e) {
        console.log('keyup');
        $('body').css('cursor','default');
        closestReferencePoint = -1;
        isMouseDown = false;
        that.update();
    })
    .mousemove(function(e) {
        if(isMouseDown){
            $('body').css('cursor','none');
            //  console.log(e.pageX + ", " + e.pageY);
            referencePointsX[closestReferencePoint] = e.pageX - leftOffset;
            referencePointsY[closestReferencePoint] = graphHeight - e.pageY;
            that.update();

        }
    });
}

var g = new graph();
var pointsX = [100, 200,250,50, 60, 120];
var pointsY = [100, 170, 200,80,70, 120];
g.drawAxes();
g.drawPoints(pointsX, pointsY);
g.drawLine([20,100],[30,50], true);
g.drawReferencePoints([20,100],[30,50]);
//console.log(g.getRSS());





