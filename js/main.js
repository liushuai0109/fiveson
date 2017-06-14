var config = {
    rows: 10,
    columns: 10,
    size: 50
};

var side = 0;
var historyStack = [];
var currentStep = 0;

function createBoard(container) {
    // 创建背景网格
    var $table = $('<table/>').addClass('grid'), i, j, $tr;
    for (i = 0; i < (config.rows - 1); i++) {
        $tr = $('<tr/>');
        for (j = 0; j < (config.columns - 1); j++) {
            $('<td/>').css({
                width: config.size,
                height: config.size
            }).appendTo($tr);
        }
        $tr.appendTo($table);
    }
    $table.appendTo(container).css({
        height: $table.css('width'),
        margin: config.size / 2 + 'px'
    });


    // 创建单元格
    var $boardTop = $('<div/>')
        .addClass('top')
        .width(config.columns * config.size)
        .height(config.rows * config.size);
    for (i = 0; i < config.rows * config.columns; i++) {
        $('<div/>').addClass('cell')
            .width(config.size)
            .height(config.size)
            .attr({
                'data-position': (Math.floor(i / config.columns)) + ',' + (i % config.columns)
            })
            .appendTo($boardTop);
    }
    $boardTop.appendTo(container);

    // 绑定事件

    $boardTop.on('click', '.cell', function () {
        $(this).attr({
            'data-status': 'done',
            'data-side': side
        });
        if (historyStack.length !== currentStep) {
            historyStack = historyStack.slice(0, currentStep);
        }
        historyStack.push([$(this).attr('data-position'), $(this).attr('data-side')]);
        currentStep = historyStack.length;
        console.log(historyStack);
        side = Math.abs(side - 1);
        $boardTop.attr('data-side', side);
        if (!checkWin.apply(null, $(this).attr('data-position').split(','))) {
            $('.current-side').text((side * 1 === 0 ? '黑' : '白') + '方下棋');
        }
    });

    $('.backward').on('click', function () {
        if (currentStep > 0) {
            currentStep--;
            $boardTop.find('[data-position="' + historyStack[currentStep][0] + '"]')
                .removeAttr('data-status')
                .removeAttr('data-side')
            side = historyStack[currentStep][1];
            $boardTop.attr('data-side', side);
            $('.current-side').text((side * 1 === 0 ? '黑' : '白') + '方下棋');
        }
    });

    $('.forward').on('click', function () {
        if (currentStep < historyStack.length) {
            $boardTop.find('[data-position="' + historyStack[currentStep][0] + '"]')
                .attr({
                    'data-status': 'done',
                    'data-side': historyStack[currentStep][1]
                });
            side = historyStack[currentStep][1];
            $boardTop.attr('data-side', side);
            $('.current-side').text((side * 1 === 0 ? '黑' : '白') + '方下棋');
            currentStep++;
        }
    });
}

function checkWin(xIndex, yIndex) {
    xIndex = xIndex * 1;
    yIndex = yIndex * 1;
    var $top = $('.top');
    var max = 0;
    var tempXIndex = xIndex;
    var tempYIndex = yIndex;


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
            /**
             while语句中为一直向某一个方向遍历
             有相同颜色的棋子的时候，Count++
             否则置flag为false，结束该该方向的遍历
             **/
            while (flag) {
                tempXIndex = tempXIndex + dir[i][j][0];
                tempYIndex = tempYIndex + dir[i][j][1];

                if ($top.find('[data-position="' + tempXIndex + ',' + tempYIndex + '"]').attr('data-side') ===
                    $top.find('[data-position="' + xIndex + ',' + yIndex + '"]').attr('data-side')) {
                    count++;
                    console.log(count);
                } else
                    flag = false;
            }
            tempXIndex = xIndex;
            tempYIndex = yIndex;
        }

        if (count >= 5) {
            max = 1;
            break;
        } else
            max = 0;
    }
    if (max === 1) {
        $('.result').text((side === 1 ? '黑' : '白') + '方胜！').show();
        return true;
    } else {
        return false;
    }
}


$(function () {
    createBoard(document.getElementById('board'));
});