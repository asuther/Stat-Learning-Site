function graph(canvasID) {
    var graphParams = {
        leftOffset: 50,
        graphHeight: 300,
        graphWidth: 300,
        pointsSizeDefault: 4
    };
    var leftOffset = 50;
    var graphHeight = 300;
    var graphWidth = 300;
    var pointSize = pointSizeDefault = 4;
    var pointsX = [];
    var pointsY = [];

    var canvas = $('#'+canvasID);
    var context = canvas.get(0).getContext('2d');

    var isMouseDown = false;
    var that = this;


    var dependencies = [];


    this.init = function() {
        this.drawAxes();
    };

    this.update = function() {

        context.fillStyle = 'white';
        context.fillRect(0,0,500,300);
        this.drawAxes();
        this.drawPoints(this.pointsX, this.pointsY);

        for(var depIndex = 0; depIndex < dependencies.length; depIndex++) {
            dependencies[depIndex].update(context);
        }


    };

    this.addDependency = function(dependencyObject) {
        dependencyObject.setGraphParams(graphParams);
        dependencies.push(dependencyObject);
    };

    this.drawAxes = function() {
        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(leftOffset, 0);
        context.lineTo(leftOffset, graphHeight);
        context.lineTo(graphWidth+leftOffset, graphHeight);
        context.stroke();

        //Drawing Y Axis Label
        context.save();
        context.fillStyle = 'black';
        context.font = '14pt Calibri';
        context.rotate(Math.PI*2/(1.334));
        context.fillText('Value 2',-200,38);
        context.restore();
    };
    this.setPoints = function(pointsX, pointsY) {
        if(pointsX.length != pointsY.length) {
            return;
        }
        //Store points
        this.pointsX = pointsX;
        this.pointsY = pointsY;

        //Broadcast the points to all dependencies
        dependencies.forEach(function(dependency) {
            dependency.setPoints(pointsX, pointsY);
        });
    };
    this.drawPoints = function(pointsX, pointsY) {
        pointSize = pointSizeDefault;
        //If the arrays are not the same length, exit
        if(pointsX.length != pointsY.length) {
            return;
        }
        context.fillStyle = 'black';
        for (var index = 0; index < pointsX.length ; index++ ) {
            context.fillRect(pointsX[index] + leftOffset, graphHeight - pointsY[index], pointSize, pointSize);
        }

    };


    this.mousedown = function(e) {
        //console.log('keydown');
        isMouseDown = true;
        //calculated distance from
        dependencies.forEach(function(dependency) {
            dependency.mousedown(e);
            dependency.update(context);
        });
        //console.log('Closest Ref Index: ' + closestReferencePoint);
    };

    this.mouseup = function(e) {
        isMouseDown = false;
        that.update();

        dependencies.forEach(function(dependency) {
            dependency.mouseup(e);
            dependency.update(context);
        });
    };

    this.mousemove = function(e) {
        that.update();
        dependencies.forEach(function(dependency) {
            dependency.mousemove(e);
            dependency.update(context);
        });
    };
    this.mousemoveNoClick = function(e) {

        that.update();
        dependencies.forEach(function(dependency) {
            dependency.mousemoveNoClick(e);
            dependency.update(context);
        });
    };
    this.getCanvas = function() {
        return canvas;
    };

    this.init();


}




