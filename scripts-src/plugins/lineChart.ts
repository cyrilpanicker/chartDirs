/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />

d3.selection.prototype.lineChart = function(data:{}[],
    keyProperty:string,
    valueProperties:ValueProperty[],
    width:number,height:number,
    padding:number,
    type:string,curveTension:number){
    
    var selection:d3.Selection<any>  = this;
    var maxValue:number;
    var valueScale:d3.scale.Linear<number,number>;
    var ordinalScale:d3.scale.Ordinal<string,number>;
    var pathGenerator:d3.svg.Line<[number,number]>;
    var coOrdinatesArray:[number,number][];
    var lineSet:d3.selection.Update<ValueProperty>;

    var updateMaxValue = () => {
        maxValue = d3.max(valueProperties.map((valueProperty) => {
            return d3.max(data,(datum) => {
                return datum[valueProperty.name];
            });
        }));
    };
    
    var updateScales = () => {
        valueScale = d3.scale.linear()
            .domain([maxValue,0])
            .range([0,height]);
        ordinalScale = d3.scale.ordinal<string,number>()
            .domain(data.map(datum => {
                return datum[keyProperty];
            }))
            .rangePoints([0,width],padding);
    };
    
    var updatePathGenerator = () => {
        pathGenerator = d3.svg.line()
            .interpolate(type)
            .tension(curveTension);
    };
    
    var pathMapper = (valueProperty) => {
        coOrdinatesArray = data.map(datum => {
            var coOrdinates:[number,number]=[0,0];
            coOrdinates[0] = ordinalScale(datum[keyProperty]);
            coOrdinates[1] = valueScale(datum[valueProperty.name]);
            return coOrdinates;
        });
        return pathGenerator(coOrdinatesArray);
    };
    
    var colorMapper = (valueProperty) => {
        return valueProperty.color;
    };
    
    var draw = () => {
        lineSet = selection.selectAll('path').data(valueProperties);
        lineSet.exit().remove();
        lineSet.enter().append('path');
        lineSet
            .attr('d',pathMapper)
            .attr('stroke',colorMapper)
            .attr('fill','none');
    };
      
    (function(){
        updateMaxValue();
        updateScales();
        updatePathGenerator();
        draw();
    })();
    
    return selection;

};