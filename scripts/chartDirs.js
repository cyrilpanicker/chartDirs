// /// <reference path="typings/tsd.d.ts" />
angular.module('chartDirs', [])
    .directive('barChart', function () {
    return {
        link: function (scope, element, attributes) {
            var attributeList = [
                'data',
                'keyConfig',
                'valuesConfig',
                'width',
                'height',
                'padding'
            ];
            var data, keyProperty, valueProperties, maxValue, width, height, padding, valueScale, barGroupScale, barScale;
            keyProperty = JSON.parse(attributes.keyConfig).name;
            valueProperties = JSON.parse(attributes.valuesConfig);
            width = parseFloat(attributes.width);
            height = parseFloat(attributes.height);
            padding = parseFloat(attributes.padding);
            var updateData = function () {
                data = JSON.parse(attributes.data);
                maxValue = d3.max(valueProperties.map(function (valueProperty) {
                    return d3.max(data, function (datum) {
                        return datum[valueProperty.name];
                    });
                }));
                valueScale = d3.scale.linear()
                    .range([0, height])
                    .domain([0, maxValue]);
                barGroupScale = d3.scale.ordinal()
                    .rangeBands([0, width], padding)
                    .domain(data.map(function (datum) {
                    return datum[keyProperty];
                }));
                barScale = d3.scale.ordinal()
                    .rangeBands([0, barGroupScale.rangeBand()])
                    .domain(valueProperties.map(function (property) {
                    return property.name;
                }));
            };
            var barGroupTranslateMapper = function (barGroupDatum) {
                return 'translate(' + barGroupScale(barGroupDatum[keyProperty]) + ',0)';
            };
            var barDataMapper = function (barGroupDatum) {
                return valueProperties.map(function (valueProperty) {
                    return {
                        name: valueProperty.name,
                        value: barGroupDatum[valueProperty.name],
                        color: valueProperty.color
                    };
                });
            };
            var keyMapper = function (datum, index) {
                return datum[keyProperty];
            };
            var xMapper = function (barDatum) {
                return barScale(barDatum.name);
            };
            var yMapper = function (barDatum) {
                return height - valueScale(barDatum.value);
            };
            var heightMapper = function (barDatum) {
                return valueScale(barDatum.value);
            };
            var widthMapper = function () {
                return barScale.rangeBand();
            };
            var colorMapper = function (barDatum) {
                return barDatum.color;
            };
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width', width)
                .attr('height', height);
            var draw = function () {
                var barGroupSet = svgElement.selectAll('.barGroup').data(data);
                barGroupSet.exit().remove();
                barGroupSet.enter().append('g').attr('class', 'barGroup');
                barGroupSet.attr('transform', barGroupTranslateMapper);
                var barSet = barGroupSet.selectAll('rect').data(barDataMapper);
                barSet.exit().remove();
                barSet.enter().append('rect');
                barSet
                    .attr('x', xMapper)
                    .attr('y', yMapper)
                    .attr('height', heightMapper)
                    .attr('width', widthMapper)
                    .attr('fill', colorMapper);
            };
            var emptyAttributeExists = function () {
                return attributeList.some(function (attribute) {
                    return attributes[attribute] === '';
                });
            };
            attributes.$observe('data', function () {
                if (!emptyAttributeExists()) {
                    updateData();
                    draw();
                }
            });
        }
    };
});
