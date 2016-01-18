// /// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    domainValues:number[];
    maxValue:string;
}

angular.module('chartDirs',[])
.directive('barChart',() => {
    
    var updateSet:d3.selection.Update<number>,
        svgElement:d3.Selection<number>,
        scale:d3.scale.Linear<number,number>,
        rangeValues:number[];
    
    var draw = (svgElement:d3.Selection<number>,values:number[]) => {
        updateSet = svgElement.selectAll('rect').data(values)
        updateSet.enter().append('rect');
        updateSet
            .transition().duration(500)
            .delay((datum,index) => index*50)
            .attr('x',(datum,index) => index*100)
            .attr('y',datum => 500-(datum*100))
            .attr('height',datum => datum*100)
            .attr('width',50)
            .attr('fill','blue');
    };
    
    return {
        scope:{
            domainValues:'=values',
            maxValue:'@'
        },
        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes) => {
            svgElement = d3.select(element[0]).append('svg')
                .attr('width',1000)
                .attr('height',500);
            scale = d3.scale.linear().domain([0,parseFloat(scope.maxValue)]).range([0,5]);
            scope.$watch('domainValues',(newValue,oldValue) => {
                if(scope.domainValues){
                    rangeValues = scope.domainValues.map(scale);
                    draw(svgElement,rangeValues);
                }
            });
        }
    }
});