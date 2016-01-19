// /// <reference path="typings/tsd.d.ts" />
angular.module('chartDirs', [])
    .directive('barChart', function () {
    return {
        scope: {
            data: '@',
            keyConfig: '@',
            valuesConfig: '@',
            maxValue: '@',
            width: '@',
            height: '@'
        },
        link: function (scope, element, attributes) {
            var data, keyProperty, valueProperties, maxValue, width, height, scale;
            var assignVariables = function () {
                data = JSON.parse(scope.data);
                keyProperty = JSON.parse(scope.keyConfig).name;
                valueProperties = JSON.parse(scope.valuesConfig);
                maxValue = parseFloat(scope.maxValue);
                width = parseFloat(scope.width);
                height = parseFloat(scope.height);
                scale = d3.scale.linear().domain([0, maxValue]).range([0, height]);
            };
            assignVariables();
            var keyMapper = function (datum, index) {
                return datum[keyProperty];
            };
            var xMapper = function (datum, index) {
                return index * 20;
            };
            var yMapper = function (datum, index) {
                return height - scale(datum[valueProperty.name]);
            };
            var heightMapper = function (datum, index) {
                return scale(datum[valueProperty.name]);
            };
            var widthMapper = function (datum, index) {
                return 10;
            };
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width', width)
                .attr('height', height);
            var draw = function () {
                var updateSet = svgElement.selectAll('rect').data(data, keyMapper);
                updateSet.exit().remove();
                updateSet.enter().append('rect');
                updateSet
                    .attr('x', xMapper)
                    .attr('y', yMapper)
                    .attr('height', heightMapper)
                    .attr('width', widthMapper)
                    .attr('fill', valueProperty.color);
            };
            scope.$watch('data+keyConfig+valuesConfig+maxValue+width+height', function () {
                if (scope.data && scope.keyConfig && scope.valuesConfig && scope.maxValue && scope.width && scope.height) {
                    assignVariables();
                    draw();
                }
            });
        }
    };
});
