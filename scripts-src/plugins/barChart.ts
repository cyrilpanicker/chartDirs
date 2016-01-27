/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />


d3.selection.prototype.barChart = function(data:{}[],
    keyProperty:string,
    valueProperties:ValueProperty[],
    width:number,height:number,
    padding:number,type:string,orientation:string){
        
    var selection:d3.Selection<any> = this;
    var maxValue:number;
    var valueScale:d3.scale.Linear<number,number>;
    var barGroupScale:d3.scale.Ordinal<string,number>;
    var barScale:d3.scale.Ordinal<string,number>;
    var barGroupSet:d3.selection.Update<{}>;
    var barSet:d3.selection.Update<{}>;
    
    var createScales = () => {
        valueScale = d3.scale.linear();
        barGroupScale = d3.scale.ordinal<string,number>();
        barScale = d3.scale.ordinal<string,number>();
    };
    
    var updateMaxValue = () => {
        maxValue = d3.max(valueProperties.map((valueProperty) => {
            return d3.max(data,(datum) => {
                return datum[valueProperty.name];
            });
        }));
    };

    var updateValueScale = () => {
        if(orientation === 'horizontal'){
            valueScale.domain([0,maxValue]).range([0,width]);
        }else if(orientation === 'vertical'){
            valueScale.domain([maxValue,0]).range([0,height]);
        }
    };
    
    var updateBarGroupScale = () => {
        if(orientation === 'horizontal'){
            barGroupScale
                .rangeBands([0,height],padding)
                .domain(data.map(datum => {
                    return datum[keyProperty];
                }));
        }else if(orientation === 'vertical'){
            barGroupScale
                .rangeBands([0,width],padding)
                .domain(data.map(datum => {
                    return datum[keyProperty];
                }));
        }
    };
    
    var updateBarScale = () => {
        if(type === 'stacked'){
            barScale = barGroupScale;
        } else if(type === 'grouped'){
            barScale
                .rangeBands([0,barGroupScale.rangeBand()])
                .domain(valueProperties.map(property => {
                    return property.name;
                }));
        }
    };
    
    var barGroupTranslateMapper = (barGroupDatum) => {
        if(orientation === 'horizontal'){
            return 'translate(0,'+barGroupScale(barGroupDatum[keyProperty])+')';
        }else if(orientation === 'vertical'){
            return 'translate('+barGroupScale(barGroupDatum[keyProperty])+',0)';
        }
    };
    
    var barDataMapper = (barGroupDatum) => {
        var barDatumArray = valueProperties.map(valueProperty => {
            return {
                name:valueProperty.name,
                value:barGroupDatum[valueProperty.name],
                color:valueProperty.color
            };
        });
        if(type === 'stacked'){
            barDatumArray.sort((datumA,datumB) => {
                return datumB.value - datumA.value;
            });
        }
        return barDatumArray;
    };
    
    var xMapper = (barDatum) => {
        if(orientation === 'horizontal'){
            return 0;
        }else if(orientation === 'vertical'){
            return barScale(barDatum.name);
        }
    };
    
    var yMapper = (barDatum) => {
        if(orientation === 'horizontal'){
            return barScale(barDatum.name);
        }else if(orientation === 'vertical'){
            return valueScale(barDatum.value);
        }
    };
    
    var heightMapper = (barDatum) => {
        if(orientation === 'horizontal'){
            return barScale.rangeBand();
        }else if(orientation === 'vertical'){
            return height-valueScale(barDatum.value);
        }
    };
    
    var widthMapper = (barDatum) => {
        if(orientation === 'horizontal'){
            return valueScale(barDatum.value);
        }else if(orientation === 'vertical'){
            return barScale.rangeBand();
        }
    };
    
    var colorMapper = (barDatum) => {
        return barDatum.color;
    };
    

    (function(){
        
        createScales();
        updateMaxValue();
        updateValueScale();
        updateBarGroupScale();
        updateBarScale();

        barGroupSet = selection.selectAll('.barGroup').data(data);
        barGroupSet.exit().remove();
        barGroupSet.enter().append('g').attr('class','barGroup');
        barGroupSet.attr('transform',barGroupTranslateMapper);

        barSet = barGroupSet.selectAll('rect').data(barDataMapper);
        barSet.exit().remove();
        barSet.enter().append('rect');
        barSet
            .attr('x',xMapper)
            .attr('y',yMapper)
            .attr('height',heightMapper)
            .attr('width',widthMapper)
            .attr('fill',colorMapper);

    })();

    return selection;
};