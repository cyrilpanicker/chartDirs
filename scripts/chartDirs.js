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
            var data, keyProperty, valueProperties, maxValue, width, height, valueScale, barGroupScale, barScale;
            var assignVariables = function () {
                data = JSON.parse(scope.data);
                keyProperty = JSON.parse(scope.keyConfig).name;
                valueProperties = JSON.parse(scope.valuesConfig);
                maxValue = parseFloat(scope.maxValue);
                width = parseFloat(scope.width);
                height = parseFloat(scope.height);
                valueScale = d3.scale.linear()
                    .domain([0, maxValue])
                    .range([0, height]);
                barGroupScale = d3.scale.ordinal()
                    .domain(data.map(function (datum) { return datum[keyProperty]; }))
                    .rangeBands([0, width], 0.5);
                barScale = d3.scale.ordinal()
                    .domain(valueProperties.map(function (property) { return property.name; }))
                    .rangeBands([0, barGroupScale.rangeBand()]);
            };
            assignVariables();
            var keyMapper = function (datum, index) {
                return datum[keyProperty];
            };
            var xMapper = function (datum, index) {
                return index * 20;
            };
            var yMapper = function (datum, index) {
                return height - valueScale(datum.value);
            };
            var heightMapper = function (datum, index) {
                return valueScale(datum.value);
            };
            var widthMapper = function (datum, index) {
                return 10;
            };
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width', width)
                .attr('height', height);
            var draw = function () {
                var barGroupSet = svgElement.selectAll('.barGroup').data(data);
                barGroupSet.exit().remove();
                barGroupSet.enter().append('g').attr('class', 'barGroup');
                barGroupSet.attr('transform', function (datum) {
                    return 'translate(' + barGroupScale(datum[keyProperty]) + ',0)';
                });
                var barSet = barGroupSet.selectAll('rect').data(function (datum) {
                    var _ = [];
                    valueProperties.forEach(function (__) {
                        _.push({
                            name: __.name,
                            value: datum[__.name],
                            color: __.color
                        });
                    });
                    return _;
                });
                barSet.exit().remove();
                barSet.enter().append('rect');
                barSet
                    .attr('x', function (datum) {
                    return barScale(datum.name);
                })
                    .attr('y', yMapper)
                    .attr('height', heightMapper)
                    .attr('width', barScale.rangeBand())
                    .attr('fill', function (datum) {
                    return datum.color;
                });
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
