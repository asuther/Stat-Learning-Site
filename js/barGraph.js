function barGraph() {

    var leftOffset = 0;
    var graphHeight = 300;
    var graphWidth = 300;
    var canvas = $('#barGraph');
    var context = canvas.get(0).getContext('2d');

    this.init = function() {
        this.drawAxes();
    };

    this.drawAxes = function() {

        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(leftOffset, 0);
        context.lineTo(leftOffset, graphHeight);
        context.lineTo(graphWidth+leftOffset, graphHeight);
        context.stroke();
    };

    this.drawBarGraph = function(value) {
        context.fillStyle = 'white';
        context.fillRect(100,0,500,299);
        context.fillStyle = 'black';

        var barHeight = (value / 99673)*graphHeight;
        var startHeight = graphHeight - (value / 99673)*graphHeight;
        context.fillRect(100, startHeight, 100, barHeight);
    };


    this.init();
}

