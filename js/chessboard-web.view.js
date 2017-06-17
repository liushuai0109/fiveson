(function () {
    var ChessboardWeb = Backbone.View.extend({
        events: {
            'click .cell': 'onClick'
        },
        el: $('<div/>').addClass('chessboard').get(0),
        initialize: function () {
            this.render();
            this.model.on('change:pieces', this.onPiecesChange.bind(this));
            this.model.on('change:side', this.onSideChange.bind(this));
        },
        render: function () {
            var $el = this.$el,
                options = this.model.options;

            $el.width(options.columns * options.size)
                .height(options.rows * options.size);
            // 创建背景网格
            var $table = $('<table/>').addClass('grid'), i, j, $tr;

            for (i = 0; i < (options.rows - 1); i++) {
                $tr = $('<tr/>');
                for (j = 0; j < (options.columns - 1); j++) {
                    $('<td/>').css({
                        width: options.size,
                        height: options.size
                    }).appendTo($tr);
                }
                $tr.appendTo($table);
            }
            $table.appendTo($el).css({
                height: $table.css('width'),
                margin: options.size / 2 + 'px'
            });
            this.drawPieces();
        },
        drawPieces: function () {
            var options = this.model.options;
            var pieces = this.model.pieces;
            var $boardTop = this.$boardTop = this.$boardTop || $('<div/>')
                    .addClass('top')
                    .width(options.columns * options.size)
                    .height(options.rows * options.size);

            $boardTop.empty();
            $.each(pieces, function (x, row) {
                var $column = $('<div/>').addClass('column');
                $.each(row, function (y, side) {
                    $('<div/>').addClass('cell')
                        .width(options.size)
                        .height(options.size)
                        .attr({
                            'data-position': x + ',' + y,
                            'data-side': side
                        })
                        .appendTo($column);
                });
                $column.appendTo($boardTop);
            });

            $boardTop.remove().appendTo(this.$el);
        },
        onClick: function (e) {
            if ($(e.currentTarget).attr('data-side')) {
                return false;
            }
            this.model.play.apply(this.model, $(e.currentTarget).attr('data-position').split(','));
        },
        onPiecesChange: function () {
            this.drawPieces();
        },
        onSideChange: function () {
            this.$el.attr('data-side', this.model.side);
        }
    });
    window.ChessboardWeb = ChessboardWeb;
}());