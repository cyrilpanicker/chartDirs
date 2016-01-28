/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />



d3.selection.prototype.arcChart = function(data:arcDatum[],
    keyProperty:string,valueProperty:string,colorConfig:colorConfig[],
    outerRadius:number,innerRadius:number){
    
    var selection:d3.Selection<any> = this;
    var arcSet:d3.selection.Update<arcDatum>;
    var fillColorScale:d3.scale.Ordinal<string,any>
    var strokeColorScale:d3.scale.Ordinal<string,any>
    
    var arcGenerator = d3.svg.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);
        
    var updateColorScales = () => {
        fillColorScale = d3.scale.ordinal()
            .domain(colorConfig.map(config => config.key))
            .range(colorConfig.map(config => config.fillColor));
        strokeColorScale = d3.scale.ordinal()
            .domain(colorConfig.map(config => config.key))
            .range(colorConfig.map(config => config.strokeColor));
    };
        
    var generateAngleData = () => {
        var endAngle = 0;
        for(var i = 0; i < data.length; i++){
            data[i].angles = [];
            data[i].angles[0] = endAngle;
            data[i].angles[1] = endAngle = endAngle + data[i][valueProperty] * 2 * Math.PI;
        }
    };
    
    var arcMapper = (datum:arcDatum) => {
        return arcGenerator
            .startAngle(datum.angles[0])
            .endAngle(datum.angles[1])(null);
    };
    
    var fillColorMapper = (datum:arcDatum) => {
        return fillColorScale(datum[keyProperty]);
    };
    
    var strokeColorMapper = (datum:arcDatum) => {
        return strokeColorScale(datum[keyProperty]);
    };
    
    var draw = () => {
        arcSet = selection.selectAll('path').data(data);
        arcSet.exit().remove();
        arcSet.enter().append('path');
        arcSet
            .attr('transform','translate('+outerRadius+','+outerRadius+')')
            .attr('d',<any>arcMapper)
            .attr('stroke',strokeColorMapper)
            .attr('fill',fillColorMapper)
    };
    
    (function(){
        updateColorScales();
        generateAngleData();
        draw();
    })();
    
    return selection;
    
};