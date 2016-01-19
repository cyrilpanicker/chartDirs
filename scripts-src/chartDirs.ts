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
                scale:d3.scale.Linear<number,number>;
            
            var assignVariables = () => {
                data = JSON.parse(scope.data);
                keyProperty = JSON.parse(scope.keyConfig).name;
                valueProperties = JSON.parse(scope.valuesConfig);
                maxValue = parseFloat(scope.maxValue);
                width = parseFloat(scope.width)
                height = parseFloat(scope.height);
                scale = d3.scale.linear().domain([0,maxValue]).range([0,height]);
            };
            
            assignVariables();
            
            var keyMapper = (datum, index) => {
                return datum[keyProperty];
            };
            
            var xMapper = (datum,index) => {
                return index*20;
            };
            
            var yMapper = (datum,index) => {
                return height-scale(datum[valueProperty.name]);
            };
            
            var heightMapper = (datum,index) => {
                return scale(datum[valueProperty.name]);
            };
            
            var widthMapper = (datum,index) => {
                return 10;
            };
            
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width',width)
                .attr('height',height);

            var draw = () => {
                var updateSet = svgElement.selectAll('rect').data(data,keyMapper);
                updateSet.exit().remove();
                updateSet.enter().append('rect');
                updateSet
                    .attr('x',xMapper)
                    .attr('y',yMapper)
                    .attr('height',heightMapper)
                    .attr('width',widthMapper)
                    .attr('fill',valueProperty.color);
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