/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />

d3.selection.prototype.lineChart = function(data:{}[],
    keyProperty:string,
    valueProperties:ValueProperty[],
    width:number,height:number,
    padding:number,type:string,orientation:string){
    
    var selection:d3.Selection<any>  = this;
    var maxValue:number;
    var valueScale:d3.scale.Linear<number,number>;
    var ordinalScale:d3.scale.Ordinal<string,number>;
    var barGroupSet:d3.selection.Update<{}>;
    var barSet:d3.selection.Update<{}>;

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
            .rangePoints([0,width]);
    };
    
    var xMapper = (datum) => {
        return ordinalScale(datum.name);
    };
    
    var yMapper = (datum) => {
        return valueScale(datum)
    };
    
    return selection;

};