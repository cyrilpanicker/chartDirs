// /// <reference path="typings/tsd.d.ts" />
angular.module('chartDirs', [])
    .directive('barChart', function () {
    var draw = function (config) {
        var updateSet = config.svgElement.selectAll('rect')
            .data(config.data, function (datum) { return datum[config.keyProp]; });
        updateSet.enter().append('rect');
        updateSet
            .transition().duration(500)
            .delay(function (datum, index) { return index * 50; })
            .attr('x', function (datum, index) { return index * 100; })
            .attr('y', function (datum) { return 500 - (config.scale(datum[config.valueProp[0]]) * 100); })
            .attr('height', function (datum) { return config.scale(datum[config.valueProp[0]]) * 100; })
            .attr('width', 50)
            .attr('fill', 'blue');
    };
    return {
        scope: {
            data: '=',
            keyProp: '@',
            valueProp: '=',
            maxValue: '@'
        },
        link: function (scope, element, attributes) {
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width', 1000)
                .attr('height', 500);
            var scale = d3.scale.linear().domain([0, parseFloat(scope.maxValue)]).range([0, 5]);
            scope.$watch('data', function (newValue, oldValue) {
                if (scope.data) {
                    draw({
                        svgElement: svgElement,
                        data: scope.data,
                        keyProp: scope.keyProp,
                        valueProp: scope.valueProp,
                        scale: scale
                    });
                }
            }, true);
        }
    };
});
