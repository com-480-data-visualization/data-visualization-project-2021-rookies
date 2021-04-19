d3.json('https://ebemunk.com/chess-dataviz/data/wrc.json', function(err, data) {
    var openings = new ChessDataViz.Openings('#openings', {
        arcThreshold: 0.002,
        textThreshold: 0.03,
        colors: d3.scale.ordinal().range(['cyan', 'gold', 'steelblue', 'gray'])
    }, data.openings);

    openings.dispatch
        .on('mouseenter', function(d, moves) {
        d3.select('#variation').text(moves.join(' '));
        var percent = d.value / data.openings.value * 100;
        percent = percent.toFixed(2);
        d3.select('#percentage').text(percent + '%');
        })
        .on('mouseleave', function() {
        d3.select('#variation').text('');
        d3.select('#percentage').text('');
        });

    var allButton = d3.select('#all');
    var d4Button = d3.select('#d4');

    allButton.on('click', function() {
        allButton.classed('button-primary', true);
        d4Button.classed('button-primary', false);
        openings.data(data.openings);
    });
    d4Button.on('click', function() {
        allButton.classed('button-primary', false);
        d4Button.classed('button-primary', true);
        openings.data(data.openings.children[1]);
    });
});

d3.json('https://ebemunk.com/chess-dataviz/data/wrc.json', function(err, data) {
    var heatmapExample2 = new ChessDataViz.HeatMap('#heatmap-example-2', {
        colorScale: ['rgb(238, 212, 172)', 'rgb(172,125,88)'],
        sizeScale: false,
        accessor: {
        color: 'w',
        piece: 'q'
        }
    }, data.heatmaps.checkSquares);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([25, -6])
        .html(function(d) {
        return d;
        });

    heatmapExample2.dispatch.on('mouseenter', tip.show);
    heatmapExample2.dispatch.on('mouseleave', tip.hide);
    heatmapExample2.dataContainer.call(tip);

    var wButton = d3.select('#w-btn');
    var bButton = d3.select('#b-btn');

    wButton.on('click', function() {
        heatmapExample2.options({
        accessor: {
            color: 'w',
            piece: 'q'
        }
        });

        wButton.classed('button-primary', true);
        bButton.classed('button-primary', false);
    });

    bButton.on('click', function() {
        heatmapExample2.options({
        accessor: {
            color: 'b',
            piece: 'q'
        }
        });

        wButton.classed('button-primary', false);
        bButton.classed('button-primary', true);
    });
});

d3.json('https://ebemunk.com/chess-dataviz/data/wrc.json', function(err, data) {
  var movePaths = new ChessDataViz.MovePaths('#movepaths', null, data.moves);
});
