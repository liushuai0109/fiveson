(function () {
    var Chess = Backbone.Model.extend({
        initialize: function (options) {
            var pieces = [];

            for (var i = 0; i < options.rows; i++) {
                var row = [];
                for (var j = 0; j < options.columns; j++) {
                    row.push(null);
                }
                pieces[i] = row;
            }
            this.options = options;
            this.pieces = pieces;
            this.side = options.side;
            this.history = [];
            this.step = 0;
        },
        play: function (x, y) {
            this.pieces[x][y] = this.side;
            this.history = this.history.slice(0, this.step);
            this.history.push([x, y, this.side]);
            this.step++;
            this.trigger('change:pieces');
            this.checkWin(x, y);
            this.toggleSide();
        },
        forward: function () {
            if (this.step < this.history.length) {
                this.side = Math.abs(this.history[this.step][2] - 1);
                this.pieces[this.history[this.step][0]][this.history[this.step][1]] = this.history[this.step][2];
                this.step++;
                this.trigger('change:side');
                this.trigger('change:pieces');
            }
        },
        backward: function () {
            if (this.step > 0) {
                this.step--;
                this.pieces[this.history[this.step][0]][this.history[this.step][1]] = null;
                this.side = this.history[this.step][2];
                this.trigger('change:side');
                this.trigger('change:pieces');
            }
        },
        checkWin: function (x, y) {
            x = x * 1;
            y = y * 1;
            var max = 0;
            var tempX = x;
            var tempY = y;
            var pieces = this.pieces;


            var dir = [
                // 横向
                [[-1, 0], [1, 0]],
                // 竖着
                [[0, -1], [0, 1]],
                // 左斜
                [[-1, -1], [1, 1]],
                // 右斜
                [[1, -1], [-1, 1]]
            ];

            for (var i = 0; i < 4; i++) {
                var count = 1;

                for (var j = 0; j < 2; j++) {
                    var flag = true;

                    while (flag) {
                        tempX = tempX + dir[i][j][0];
                        tempY = tempY + dir[i][j][1];

                        if ((pieces[tempX] && pieces[tempX][tempY]) === (pieces[x] && pieces[x][y])) {
                            count++;
                            console.log(count);
                        } else {
                            flag = false;
                        }
                    }
                    tempX = x;
                    tempY = y;
                }

                if (count >= 5) {
                    max = 1;
                    break;
                } else
                    max = 0;
            }
            if (max === 1) {
                this.trigger('change:win', this.side);
                return this.side;
            } else {
                return false;
            }
        },
        toggleSide: function () {
            this.side = Math.abs(this.side - 1);
            this.trigger('change:side');
        }
    });
    window.Chess = Chess;
}());