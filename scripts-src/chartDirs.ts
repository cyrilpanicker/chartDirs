// /// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    data:{}[];
    keyProp:string;
    valueProp:string[];
    maxValue:string;
}

interface DrawingConfig{
    data:{}[];
    keyProp:string;
    valueProp:string[];
}

angular.module('chartDirs',[])
.directive('barChart',() => {
    
    var updateSet:d3.selection.Update<{}>,
        svgElement:d3.Selection<number>,
        scale:d3.scale.Linear<number,number>;
    
    var draw = (config:DrawingConfig) => {
        updateSet = svgElement.selectAll('rect')
            .data(config.data,datum => datum[config.keyProp]);
        updateSet.enter().append('rect');
        updateSet
            .transition().duration(500)
            .delay((datum,index) => index*50)
            .attr('x',(datum,index) => index*100)
            .attr('y',datum => 500-(scale(datum[config.valueProp[0]])*100))
            .attr('height',datum => scale(datum[config.valueProp[0]])*100)
            .attr('width',50)
            .attr('fill','blue');
    };
    
    return {
        scope:{
            data:'=',
            keyProp:'@',
            valueProp:'=',
            maxValue:'@'
        },
        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes) => {
            svgElement = d3.select(element[0]).append('svg')
                .attr('width',1000)
                .attr('height',500);
            scale = d3.scale.linear().domain([0,parseFloat(scope.maxValue)]).range([0,5]);
            scope.$watch('data',(newValue,oldValue) => {
                if(scope.data){
                    draw({
                        data:scope.data,
                        keyProp:scope.keyProp,
                        valueProp:scope.valueProp
                    });
                }
            },true);
        }
    }
});