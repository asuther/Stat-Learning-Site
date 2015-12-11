function LinearRegressionModel() {

    var referencePointsX = [];
    var referencePointsY = [];
    var staticLine = false;

    var graphParams = {};

    var lineStats = {
        m: 0,
        b: 0
    };

    var RSS = 99999;

    var closestReferencePoint = 0;
    var closestReferenceInfo = {};

    var isMouseDown = false;
    var that = this;

    var pointsX;
    var pointsY;
    var originalPointsX;
    var originalPointsY;

    var observers = [];

    this.xVariance = 0;



    this.init = function() {
        this.setReferencePoints([0,200],[100,150]);
    };
    this.setGraphParams = function(graphParams) {
        this.graphParams = graphParams;
    };

    this.setReferencePoints = function(referencePointsX, referencePointsY) {
        if(referencePointsX.length != 2 || referencePointsX.length != referencePointsY.length) {
            return;
        }
        this.referencePointsX = referencePointsX;
        this.referencePointsY = referencePointsY;

    };
    this.disableReferencePoints = function(disableFirst, disableSecond) {
        if (disableFirst && disableSecond)
            this.staticLine = true;
        if (disableFirst && !disableSecond) {
            this.referencePointsX[0] *= -1;
            this.referencePointsY[0] *= -1;
        }
    }

    this.addObserver = function(newObserver) {
        observers.push(newObserver);
    };

    /*********************************************************************

                    ###        ###            #        #           #
                    #   #      #   #         # #       #           #
                    #    #     #    #       #   #       #         #
                    #    #     #  #        #######       #   #   #
                    #   #      #   #      #       #       # # # #
                    ###        #    #    #         #       #   #

    *********************************************************************/


    this.update = function(context) {
        this.drawLine(context, this.referencePointsX, this.referencePointsY, true);
        if(!this.staticLine)
            this.drawReferencePoints(context, this.referencePointsX, this.referencePointsY);

        RSS = this.calculateRSS();

        if($('#showRSS').is(':checked')) {
            this.drawRSS(context);
        }


    };

    this.drawReferencePoints = function(context, pointsX, pointsY) {


        for (var referenceIndex = 0; referenceIndex < pointsX.length ; referenceIndex++ ) {
            context.beginPath();
            context.fillStyle = 'blue';
            pointSize = pointSizeDefault;
            if(referenceIndex == closestReferencePoint && isMouseDown){
                context.fillStyle = 'red';
            } else if(closestReferenceInfo.closestRefIndex == referenceIndex && closestReferenceInfo.closestRefDistance < 15) {
                context.fillStyle = 'orange';
                pointSize = 6;
            }


            context.arc(pointsX[referenceIndex] + this.graphParams.leftOffset, this.graphParams.graphHeight - pointsY[referenceIndex], pointSize, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
        }

       // context.fillOval(pointsX[1] + leftOffset - pointSize, graphHeight - pointsY[1] - pointSize, pointSize*2, pointSize*2);
    };

    this.drawLine = function(context, refPointsX, refPointsY, extrapolate) {

        var pointsArrayLength = refPointsX.length;
        extrapolate = extrapolate || false;
        context.strokeStyle = 'black';

        context.beginPath();
        if(extrapolate) {
            //Determine y = mx + b
            lineStats.m = ( refPointsY[ pointsArrayLength - 1 ] - refPointsY[ pointsArrayLength - 2 ] ) / ( refPointsX[ pointsArrayLength - 1] - refPointsX[ pointsArrayLength - 2 ]);
            lineStats.b = refPointsY[0] - lineStats.m * refPointsX[0];
            context.moveTo(0 + this.graphParams.leftOffset,this.graphParams.graphHeight - lineStats.b);
        } else {
            context.moveTo(refPointsX[0]+ this.graphParams.leftOffset,this.graphParams.graphHeight - refPointsY[0]);
        }

        for (var index = 1; index < refPointsX.length ; index++ ) {
            context.lineTo(refPointsX[index]+ this.graphParams.leftOffset, this.graphParams.graphHeight - refPointsY[index]);
        }

        if(extrapolate) {
            finalY = lineStats.m  * ( this.graphParams.graphWidth ) + lineStats.b;
            context.lineTo(this.graphParams.graphWidth + this.graphParams.leftOffset, this.graphParams.graphHeight - finalY);
        }
        context.stroke();
    };

    this.drawRSS = function(context) {
        for (var index = 0 ; index < this.pointsX.length ; index++ ) {
            predictedY = lineStats.m * this.pointsX[index] + lineStats.b;
            squaredResidual = Math.pow(predictedY - this.pointsY[index], 2);

            context.beginPath();
            context.moveTo(this.pointsX[index] + this.graphParams.leftOffset + 2, this.graphParams.graphHeight - this.pointsY[index]);
            context.lineTo(this.pointsX[index] + this.graphParams.leftOffset + 2, this.graphParams.graphHeight - predictedY);
            context.strokeStyle = '#FF0000';
            context.stroke();
            context.fillStyle = 'black';
            context.font = '9pt Calibri';
            context.fillText(Math.round(squaredResidual), this.pointsX[index] + this.graphParams.leftOffset + 5, this.graphParams.graphHeight - (this.pointsY[index] + (predictedY - this.pointsY[index])/2) + 5)
        }
    };

    this.calculateRSS = function() {
        var RSS = 0;
        //context.strokeStyle = '#FF0000';
        for (var index = 0 ; index < this.pointsX.length ; index++ ) {
            predictedY = lineStats.m * this.pointsX[index] + lineStats.b;
            squaredResidual = Math.pow(predictedY - this.pointsY[index], 2);
            //console.log('Predicted Y: ' + predictedY);
            //console.log('Actual Y: ' + this.pointsY[index]);
            //console.log('Sq Res: ' + squaredResidual);
            RSS += squaredResidual;
         }
        return RSS;
    };

    this.getRSS = function() {
        return this.calculateRSS();
    };


    //Custom Functions for lesson
    this.calculateBeta = function() {
        //console.log(this.referencePointsX[1]);
        return ( this.referencePointsY[1] - this.referencePointsY[0] ) / ( this.referencePointsX[1] - this.referencePointsX[0] );

    };
    this.calculateSEBeta = function() {
        var meanX = this.calculateMeanX();
        var currentRSS = this.calculateRSS();
        this.xVariance = 0;
        for (var index = 0 ; index < this.pointsX.length ; index++ ) {
            this.xVariance+=Math.pow((this.pointsX[index] - meanX), 2)
        }
        return Math.sqrt(currentRSS / (13 * this.xVariance)).toFixed(2);

    };

    this.calculateMeanX = function() {
        var totalX = 0;
        for (var index = 0 ; index < this.pointsX.length ; index++ ) {
            totalX+=this.pointsX[index];
        }

        return totalX / this.pointsX.length;
    }

    this.getClosestReferencePoint = function(pageClickedX, pageClickedY, referencePointsX, referencePointsY) {

        var distances = [0,0];
        var shortestDistance = 2000000;
        var shortestDistanceIndex = -1;
        //console.log('(' + pageClickedX + ", " + pageClickedY + ')');
        clickedX = (pageClickedX - this.graphParams.leftOffset);
        clickedY = (this.graphParams.graphHeight - pageClickedY);
        //console.log('(' + clickedX + ", " + clickedY + ')');
        for (var index = 0; index < referencePointsX.length ; index++ ) {

            currentDistance = Math.sqrt(  Math.pow(clickedX - referencePointsX[index] , 2) + Math.pow(clickedY - referencePointsY[index], 2) );
            if(currentDistance < shortestDistance) {
                shortestDistance = currentDistance;
                shortestDistanceIndex = index;
            }
        }
        return {'closestRefIndex':shortestDistanceIndex, 'closestRefDistance': shortestDistance};
    };

    this.mousedown = function(e) {

        isMouseDown = true;
        //calculated distance from
        closestReferencePoint = that.getClosestReferencePoint(e.offsetX, e.offsetY, that.referencePointsX, that.referencePointsY).closestRefIndex;
        //console.log('Closest Ref Index: ' + closestReferencePoint);
    };

    this.mouseup = function(e) {
        //console.log('keyup');
        $('body').css('cursor','default');
        closestReferencePoint = -1;
        isMouseDown = false;
    };

    this.mousemove = function(e) {

        if(isMouseDown && !this.staticLine){
            $('body').css('cursor','none');
            //console.log(e.offsetX + ", " + e.offsetY);
            that.referencePointsX[closestReferencePoint] = (e.offsetX - this.graphParams.leftOffset);
            that.referencePointsY[closestReferencePoint] = this.graphParams.graphHeight - e.offsetY;

            observers.forEach(function(observer) {
                observer.addPoint(lineStats.m*200, RSS/50);
                observer.drawHighLightPoint(lineStats.m*200, RSS/50);
            });
            //console.log('Reference X: ' + (referencePointsX[closestReferencePoint]));
        }

    };
    this.mousemoveNoClick = function(e) {
        closestReferenceInfo = that.getClosestReferencePoint(e.offsetX, e.offsetY, referencePointsX, referencePointsY);
    };

    this.getReferencePoints = function() {
        return [ [referencePointsX[0], referencePointsY[0]], [referencePointsX[1], referencePointsY[1]] ];
    };

    this.setPoints = function(pointsX, pointsY) {
        this.pointsX = pointsX;
        this.pointsY = pointsY;

        this.originalPointsX = pointsX.slice();
        this.originalPointsY = pointsY.slice();
    };

    this.addVarianceToPoints = function(varianceValue) {
        var varianceValue = parseFloat(varianceValue);
        for (var point_index = 0; point_index < this.pointsY.length; point_index++ ) {
            if ( point_index % 2 == 0 ){
                multiplier = 1;
            } else {
                multiplier = -1;
            }
            this.pointsY[point_index] = parseFloat(this.originalPointsY[point_index] + ( multiplier * varianceValue) );
        }
    };

    this.init();
}
