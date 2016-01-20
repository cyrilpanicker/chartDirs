// /// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    width:string;
    height:string;
    padding:string;
}

interface ValueProperty{
    name:string;
    color:string;
}

interface BarChartAttributes extends ng.IAttributes{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    width:string;
    height:string;
    padding:string;
}

angular.module('chartDirs',[])
.directive('barChart',() => {

    return {

        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes:BarChartAttributes) => {
            
            var attributeList = [
                'data',
                'keyConfig',
                'valuesConfig',
                'width',
                'height',
                'padding'
            ];
            
            var data:{}[],
                keyProperty:string,
                valueProperties:ValueProperty[],
                maxValue:number,
                width:number,
                height:number,
                padding:number,
                valueScale:d3.scale.Linear<number,number>,
                barGroupScale:d3.scale.Ordinal<string,number>,
                barScale:d3.scale.Ordinal<string,number>;
                
            keyProperty = JSON.parse(attributes.keyConfig).name;
            valueProperties = JSON.parse(attributes.valuesConfig);
            width = parseFloat(attributes.width)
            height = parseFloat(attributes.height);
            padding = parseFloat(attributes.padding);
            
            var updateData = () => {

                data = JSON.parse(attributes.data);
                
                maxValue = d3.max(valueProperties.map((valueProperty) => {
                    return d3.max(data,(datum) => {
                        return datum[valueProperty.name];
                    });
                }));

                valueScale = d3.scale.linear()
                    .range([0,height])
                    .domain([0,maxValue]);

                barGroupScale = d3.scale.ordinal()
                    .rangeBands([0,width],padding)
                    .domain(data.map(datum => {
                        return datum[keyProperty];
                    }));

                barScale = d3.scale.ordinal()
                    .rangeBands([0,barGroupScale.rangeBand()])
                    .domain(valueProperties.map(property => {
                        return property.name;
                    }));

            };
            
            var barGroupTranslateMapper = (barGroupDatum) => {
                return 'translate('+barGroupScale(barGroupDatum[keyProperty])+',0)';
            };
            
            var barDataMapper = (barGroupDatum) => {
                return valueProperties.map(valueProperty => {
                    return {
                        name:valueProperty.name,
                        value:barGroupDatum[valueProperty.name],
                        color:valueProperty.color
                    };
                });
            };
            
            var keyMapper = (datum, index) => {
                return datum[keyProperty];
            };
            
            var xMapper = (barDatum) => {
                return barScale(barDatum.name);
            };
            
            var yMapper = (barDatum) => {
                return height-valueScale(barDatum.value);
            };
            
            var heightMapper = (barDatum) => {
                return valueScale(barDatum.value);
            };
            
            var widthMapper = () => {
                return barScale.rangeBand();
            };
            
            var colorMapper = (barDatum) => {
                return barDatum.color;
            };
            
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width',width)
                .attr('height',height);

            var draw = () => {

                var barGroupSet = svgElement.selectAll('.barGroup').data(data);
                barGroupSet.exit().remove();
                barGroupSet.enter().append('g').attr('class','barGroup');
                barGroupSet.attr('transform',barGroupTranslateMapper);

                var barSet = barGroupSet.selectAll('rect').data(barDataMapper);
                barSet.exit().remove();
                barSet.enter().append('rect');
                barSet
                    .attr('x',xMapper)
                    .attr('y',yMapper)
                    .attr('height',heightMapper)
                    .attr('width',widthMapper)
                    .attr('fill',colorMapper);

            };
            
            var emptyAttributeExists = () => {
                return attributeList.some((attribute) => {
                    return attributes[attribute] === '';
                })
            };
            
            attributes.$observe('data',() => {
                if(!emptyAttributeExists()){
                    updateData();
                    draw();
                }
            });
           
        }
    }
});