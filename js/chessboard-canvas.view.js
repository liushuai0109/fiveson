(function () {
    var ChessboardCanvas = Backbone.View.extend({
        tagName: 'canvas',
        el: $('<canvas/>').get(0),
        events: {
            'mousemove': 'onMouseMove',
            'click': 'onClick'
        },
        initialize: function () {
            this.lastPosition = [0, 0];
            this.render();
            this.model.on('change:pieces', this.onPiecesChange.bind(this));
        },
        render: function () {
            var options = this.model.options;
            var width = options.columns * options.size;
            var height = options.rows * options.size;
            var devicePixelRatio = window.devicePixelRatio;
            var canvas = this.el;
            this.context = canvas.getContext('2d');

            this.$el.attr({
                width: width * devicePixelRatio,
                height: height * devicePixelRatio
            });

            this.$el.width(width);
            this.$el.height(height);

            this.drawGrid();
        },
        drawGrid: function () {
            var devicePixelRatio = window.devicePixelRatio,
                context = this.context,
                options = this.model.options,
                width = devicePixelRatio * options.columns * options.size,
                height = devicePixelRatio * options.rows * options.size,
                i;

            context.fillStyle = '#f0f0f0';
            context.fillRect(0, 0, width, height);
            context.fillStyle = '#c0c0c0';

            for (i = 0; i < options.rows; i++) {
                context.fillRect(
                    options.size * devicePixelRatio / 2,
                    options.size * devicePixelRatio * (i + 0.5),
                    options.size * devicePixelRatio * (options.columns - 1),
                    1
                );
            }

            for (i = 0; i < options.columns; i++) {
                context.fillRect(
                    options.size * devicePixelRatio * (i + 0.5),
                    options.size * devicePixelRatio / 2,
                    1,
                    options.size * devicePixelRatio * (options.rows - 1)
                );
            }
        },
        drawPieces: function () {
            var context = this.context,
                pieces = this.model.pieces,
                self = this;
            $.each(pieces, function (x, row) {
                $.each(row, function (y, side) {
                    if (side !== null) {
                        self.drawPiece(x, y, side);
                    }
                });
            });
        },
        drawPiece: function (x, y, side) {
            var context = this.context,
                options = this.model.options;
            context.fillStyle = side ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
            context.beginPath();
            context.arc(
                options.size * devicePixelRatio * (x + 0.5),
                options.size * devicePixelRatio * (y + 0.5),
                options.size * devicePixelRatio * 0.45, 0, Math.PI * 2);
            context.fill();
        },
        clearCanvas: function () {
            var options = this.model.options;
            this.context.clearRect(0, 0,
                options.size * options.columns * devicePixelRatio,
                options.size * options.rows * devicePixelRatio);
        },
        onMouseMove: function (e) {
            var options = this.model.options;
            var width = options.columns * options.size;
            var height = options.rows * options.size;
            var context = this.context;
            var devicePixelRatio = window.devicePixelRatio;
            var lastPosition = this.lastPosition;
            var pieces = this.model.pieces;
            var x = e.offsetX;
            var y = e.offsetY;
            var centerX = options.size * devicePixelRatio * (Math.floor(x / options.size) + 0.5);
            var centerY = options.size * devicePixelRatio * (Math.floor(y / options.size) + 0.5);
            var positionX = Math.floor(x / options.size);
            var positionY = Math.floor(y / options.size);

            //console.log(x, y);
            console.log(lastPosition[0], centerX, lastPosition[1], centerY);
            if (lastPosition[0] === centerX && lastPosition[1] === centerY
                || pieces[positionX][positionY] !== null) {
                return false;
            }
            this.lastPosition = [centerX, centerY];
            console.log(width * devicePixelRatio, height * devicePixelRatio);
            this.clearCanvas();
            this.drawGrid();
            this.drawPieces();

            context.fillStyle = this.model.side ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
            context.beginPath();
            context.arc(
                centerX,
                centerY,
                options.size * devicePixelRatio * 0.45, 0, Math.PI * 2);
            context.fill();
        },
        onClick: function (e) {
            var options = this.model.options;
            var pieces = this.model.pieces;
            var x = e.offsetX;
            var y = e.offsetY;
            var positionX = Math.floor(x / options.size);
            var positionY = Math.floor(y / options.size);

            console.log(positionX, positionY);

            if (pieces[positionX][positionY] !== null) {
                return false;
            }
            this.model.play(positionX, positionY);
        },
        onPiecesChange: function () {
            this.clearCanvas();
            this.drawGrid();
            this.drawPieces();
        }
    });

    window.ChessboardCanvas = ChessboardCanvas;
}());