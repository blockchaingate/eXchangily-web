__customIndicators = [{
    name: 'ShuBenRSI',
    metainfo: {
        '_metainfoVersion': 40,
        'id': 'ShuBenRSI@tv-basicstudies-1',
        'scriptIdPart': '',
        'name': 'ShuBenRSI',
        'description': 'ShuBenRSI',
        'shortDescription': 'ShuBenRSI',
        'is_hidden_study': true,
        'is_price_study': true,
        'isCustomIndicator': true,
        'plots': [{ 'id': 'plot_0', 'type': 'line' }],
        'defaults': {
            'styles': {
                'plot_0': {
                    'linestyle': 0,
                    'visible': true,
                    'linewidth': 1,
                    'plottype': 2, // 绘制类型为线形图： 2
                    'trackPrice': true,
                    'transparency': 40,
                    'color': '#880000'
                }
            },
            'precision': 1, // 精度 eg：608.4
            'inputs': {}
        },
        'styles': {
            'plot_0': {
                'title': 'ShuBenRSI',
                'histogrambase': 0,
            }
        },
        'inputs': [],
    },
    constructor: function() {
        this.init = function(context, inputCallback) {
            this._context = context;
            this._input = inputCallback;
            //var symbol = 'p1905';
            var symbol = PineJS.Std.ticker(this._context); // 获取所选商品代码
            this._context.new_sym(symbol, PineJS.Std.period(this._context), PineJS.Std.period(this._context));
        };
        this.main = function(context, inputCallback) {
            this._context = context;
            this._input = inputCallback;
            this._context.select_sym(1);
            if (this._context['symbol']['time'] != NaN) {
                var c = PineJS.Std.close(this._context) - 50;
                var o = PineJS.Std.open(this._context) - 50;
                var l = PineJS.Std.low(this._context) - 50;
                var h = PineJS.Std.high(this._context) - 50;
                console.log('execute custom index!');
                console.log('symbol: ', this._context['symbol']['time']);
                return [o, c];
            }

        }
    }
}];