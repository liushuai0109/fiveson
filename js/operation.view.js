(function () {
    var Operation = Backbone.View.extend({
        tagName: 'div',
        el: $('<div/>').addClass('operation').get(0),
        events: {
            'click .btn-backward': 'backward',
            'click .btn-forward': 'forward',
            'click .btn-reload': 'reload'
        },
        initialize: function () {
            //this.model = new Chess()
            this.render();
            this.model.on('change:side', this.onSideChange.bind(this));
            this.model.on('change:win', this.onWin.bind(this))
        },
        render: function () {

            $('<button/>').addClass('btn-forward')
                .text('撤销悔棋')
                .appendTo(this.el);

            $('<button/>').addClass('btn-backward')
                .text('悔棋')
                .appendTo(this.el);

            this.$side = $('<div/>').addClass('side')
                .text((this.model.side === 0 ? '黑' : '白') + '方下棋')
                .appendTo(this.el);

            this.$result = $('<div/>').addClass('result')
                .appendTo(this.el);

            this.$resultText = $('<div/>').appendTo(this.$result);
            $('<button/>').addClass('btn-reload').text('再来一局').appendTo(this.$result);
        },
        backward: function () {
            this.model.backward();
        },
        forward: function () {
            this.model.forward();
        },
        reload: function () {
            location.reload();
        },
        onSideChange: function () {
            this.$side.text((this.model.side === 0 ? '黑' : '白') + '方下棋');
        },
        onWin: function (side) {
            this.$resultText.text((side === 0 ? '黑' : '白') + '方胜');
            this.$result.show();
        }
    });
    window.Operation = Operation;
}());