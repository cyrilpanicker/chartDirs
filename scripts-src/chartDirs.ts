// /// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    data:{}[];
    keyProp:string;
    valueProp:string[];
    maxValue:string;
    width:string;
    height:string;
}

interface DrawingConfig{
    svgElement:d3.Selection<number>;
    data:{}[];
    keyProp:string;
    valueProp:string[];
    scale:d3.scale.Linear<number,number>;
}

angular.module('chartDirs',[])
.directive('barChart',() => {
    
    var draw = (config:DrawingConfig) => {
        var updateSet = config.svgElement.selectAll('rect')
            .data(config.data,datum => datum[config.keyProp]);
        updateSet.enter().append('rect');
        updateSet
            .transition().duration(500)
            .delay((datum,index) => index*50)
            .attr('x',(datum,index) => index*100)
            .attr('y',datum => 500-(config.scale(datum[config.valueProp[0]])*100))
            .attr('height',datum => config.scale(datum[config.valueProp[0]])*100)
            .attr('width',50)
            .attr('fill','blue');
    };
    
    return {
        scope:{
            data:'=',
            keyProp:'@',
            valueProp:'=',
            maxValue:'@',
            width:'@',
            height:'@'
        },
        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes) => {
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width',parseFloat(scope.width))
                .attr('height',parseFloat(scope.height));
            var scale = d3.scale.linear().domain([0,parseFloat(scope.maxValue)]).range([0,5]);
            scope.$watch('data',(newValue,oldValue) => {
                if(scope.data){
                    draw({
                        svgElement:svgElement,
                        data:scope.data,
                        keyProp:scope.keyProp,
                        valueProp:scope.valueProp,
                        scale:scale
                    });
                }
            },true);
            scope.$watch('valueProp',() => {
                if(scope.valueProp){
                    draw({
                        svgElement:svgElement,
                        data:scope.data,
                        keyProp:scope.keyProp,
                        valueProp:scope.valueProp,
                        scale:scale
                    });
                }
            });
        }
    }
});