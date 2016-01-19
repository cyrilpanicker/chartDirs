// /// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    maxValue:string;
    width:string;
    height:string;
}

interface ValueProperty{
    name:string;
    color:string;
}

angular.module('chartDirs',[])
.directive('barChart',() => {

    return {

        scope:{
            data:'@',
            keyConfig:'@',
            valuesConfig:'@',
            maxValue:'@',
            width:'@',
            height:'@'
        },

        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes) => {
            
            var data:{}[],
                keyProperty:string,
                valueProperties:ValueProperty[],
                maxValue:number,
                width:number,
                height:number,
                valueScale:d3.scale.Linear<number,number>,
                barGroupScale:d3.scale.Ordinal<string,number>,
                barScale:d3.scale.Ordinal<string,number>;
            
            var assignVariables = () => {
                data = JSON.parse(scope.data);
                keyProperty = JSON.parse(scope.keyConfig).name;
                valueProperties = JSON.parse(scope.valuesConfig);
                maxValue = parseFloat(scope.maxValue);
                width = parseFloat(scope.width)
                height = parseFloat(scope.height);
                valueScale = d3.scale.linear()
                    .domain([0,maxValue])
                    .range([0,height]);
                barGroupScale = d3.scale.ordinal()
                    .domain(data.map(datum => datum[keyProperty]))
                    .rangeBands([0,width],0.5);
                barScale = d3.scale.ordinal()
                    .domain(valueProperties.map(property => property.name))
                    .rangeBands([0,barGroupScale.rangeBand()]);
            };
            
            assignVariables();
            
            var keyMapper = (datum, index) => {
                return datum[keyProperty];
            };
            
            var xMapper = (datum,index) => {
                return index*20;
            };
            
            var yMapper = (datum,index) => {
                return height-valueScale(datum.value);
            };
            
            var heightMapper = (datum,index) => {
                return valueScale(datum.value);
            };
            
            var widthMapper = (datum,index) => {
                return 10;
            };
            
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width',width)
                .attr('height',height);

            var draw = () => {
                var barGroupSet = svgElement.selectAll('.barGroup').data(data);
                barGroupSet.exit().remove();
                barGroupSet.enter().append('g').attr('class','barGroup');
                barGroupSet.attr('transform',datum => {
                    return 'translate('+barGroupScale(datum[keyProperty])+',0)';
                });
                var barSet = barGroupSet.selectAll('rect').data(datum => {
                    var _ = [];
                    valueProperties.forEach(__ => {
                        _.push({
                            name:__.name,
                            value:datum[__.name],
                            color:__.color
                        });
                    });
                    return _;
                });
                barSet.exit().remove();
                barSet.enter().append('rect');
                barSet
                    .attr('x',datum => {
                        return barScale(datum.name);
                    })
                    .attr('y',yMapper)
                    .attr('height',heightMapper)
                    .attr('width',barScale.rangeBand())
                    .attr('fill',datum => {
                        return datum.color;
                    });
            };

            scope.$watch('data+keyConfig+valuesConfig+maxValue+width+height',() => {
                if(scope.data && scope.keyConfig && scope.valuesConfig && scope.maxValue && scope.width && scope.height){
                    assignVariables();
                    draw();
                }
            });
        }
    }
});