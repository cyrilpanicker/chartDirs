// /// <reference path="typings/tsd.d.ts" />
angular.module('chartDirs', [])
    .directive('barChart', function () {
    var updateSet, svgElement, scale, rangeValues;
    var draw = function (svgElement, values) {
        updateSet = svgElement.selectAll('rect').data(values);
        updateSet.enter().append('rect');
        updateSet
            .transition().duration(500)
            .delay(function (datum, index) { return index * 50; })
            .attr('x', function (datum, index) { return index * 100; })
            .attr('y', function (datum) { return 500 - (datum * 100); })
            .attr('height', function (datum) { return datum * 100; })
            .attr('width', 50)
            .attr('fill', 'blue');
    };
    return {
        scope: {
            domainValues: '=values',
            maxValue: '@'
        },
        link: function (scope, element, attributes) {
            svgElement = d3.select(element[0]).append('svg')
                .attr('width', 1000)
                .attr('height', 500);
            scale = d3.scale.linear().domain([0, parseFloat(scope.maxValue)]).range([0, 5]);
            scope.$watch('domainValues', function (newValue, oldValue) {
                if (scope.domainValues) {
                    rangeValues = scope.domainValues.map(scale);
                    draw(svgElement, rangeValues);
                }
            });
        }
    };
});
