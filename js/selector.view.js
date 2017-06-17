(function () {
    var Selector = Backbone.View.extend({
        tagName: 'div',
        el: $('<div/>').addClass('selector').get(0),
        events: {
            'click .select': 'select'
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            $('<div/>').text('选择棋盘渲染方式：').appendTo(this.$el);
            $('<div/>')
                .addClass('select')
                .attr('data-val', 'dom')
                .text('DOM')
                .appendTo(this.$el);
            $('<div/>')
                .addClass('select')
                .attr('data-val', 'canvas')
                .text('CANVAS')
                .appendTo(this.$el);
        },
        select: function (e) {
            var chess = new Chess({
                rows: 10,
                columns: 10,
                size: 50,
                side: 0
            });
            var operation = new Operation({model: chess});
            operation.$el.appendTo(this.$el.empty());
            switch ($(e.currentTarget).attr('data-val')) {
                case 'dom':
                    var chessboardWeb = new ChessboardWeb({model: chess});
                    chessboardWeb.$el.appendTo(this.$el);
                    break;
                case 'canvas':
                    var chessboardCanvas = new ChessboardCanvas({model: chess});
                    chessboardCanvas.$el.appendTo(this.$el);
                    break;
            }
        }
    });
    window.Selector = Selector;
}());