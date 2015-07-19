function barGraph() {

    var leftOffset = 50;
    var graphHeight = 300;
    var graphWidth = 200;
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

        //Drawing Y Axis Label
        context.save();
        context.fillStyle = 'black';
        context.font = '14pt Calibri';
        context.rotate(Math.PI*2/(1.334));
        context.fillText('Total RSS',-200,30);
        context.restore();
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

