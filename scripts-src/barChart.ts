/// <reference path="typings/tsd.d.ts" />
/// <reference path="customTypes.d.ts" />

angular.module('chartDirs')
.directive('barChart',() => {

    return {

        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes:BarChartAttributes) => {
            
                // 'data',
                // 'keyConfig',
                // 'valuesConfig',
                // 'width',
                // 'height',
                // 'padding' => 0 to 1  => default 0,
                // 'type'  => [grouped,stacked] => default grouped
                // 'orientation' => [vertical,horizontal] => default vertical
            
            var data:Data[],
                keyProperty:string,
                valueProperties:ValueProperty[],
                maxValue:number,
                width:number,
                height:number,
                padding:number,
                type:string,
                orientation:string,
                valueScale:d3.scale.Linear<number,number>,
                barGroupScale:d3.scale.Ordinal<string,number>,
                barScale:d3.scale.Ordinal<string,number>,
                svgElement:d3.Selection<Data>;
                
            var assignWidthAndHeightProperties = () => {
                height = parseFloat(attributes.height);
                width = parseFloat(attributes.width);
                if(isNaN(height)){
                     throw 'empty or invalid height provided';
                };
                if(isNaN(width)){
                    throw 'empty or invalid width provided';
                }
            };
            
            var assignOptionalProperties = () => {
                padding = !attributes.padding || isNaN(parseFloat(attributes.padding)) ? 0 :  parseFloat(attributes.padding);
                orientation = !attributes.orientation || ['horizontal','vertical'].indexOf(attributes.orientation) === -1 ? 'vertical' : attributes.orientation;
                type = !attributes.type || ['grouped','stacked'].indexOf(attributes.type) === -1 ? 'grouped' : attributes.type;
            };
            
            var createScales = () => {
                valueScale = d3.scale.linear();
                barGroupScale = d3.scale.ordinal<string,number>();
                barScale = d3.scale.ordinal<string,number>();
            };
            
            var assignKeyProperty = () => {
                try{
                    if(!attributes.keyConfig){
                        throw 'empty "key-config" provided';
                    }
                    keyProperty = JSON.parse(attributes.keyConfig).name;
                    if(!keyProperty){
                        throw '"key-config" does not have name property';
                    }
                }catch(exception){
                    throw 'empty or invalid "key-config" provided : \n'+exception;
                }
            };
            
            var assignValueProperties = () => {
                try{
                    if(!attributes.valuesConfig){
                        throw 'empty "values-config" provided';
                    }
                    valueProperties = JSON.parse(attributes.valuesConfig);
                    if (!Array.isArray(valueProperties)){
                        throw '"values-config" should be an array';
                    }
                    if(!valueProperties.every(valueProperty => {
                        return ('name' in valueProperty);
                    })){
                        throw '"name" property missing in value for "values-config"';
                    }
                    if(!valueProperties.every(valueProperty => {
                        return ('color' in valueProperty);
                    })){
                        throw '"color" property missing in value for "values-config"';
                    }
                }catch(exception){
                    throw 'empty or invalid "values-config" provided : \n'+exception;
                }
            };
            
            var createSvg = () => {
                svgElement = d3.select(element[0]).append('svg')
                    .attr('width',width)
                    .attr('height',height);
            };
            
            var updateData = () => {
                data = JSON.parse(attributes.data);
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
            
            var keyMapper = (datum, index) => {
                return datum[keyProperty];
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
            
            (function(){
                assignWidthAndHeightProperties();
                assignOptionalProperties();
                createScales();
                assignKeyProperty();
                assignValueProperties();
                createSvg();
                attributes.$observe('data',() => {
                    if(attributes.data){
                        updateData();
                        updateValueScale();
                        updateBarGroupScale();
                        updateBarScale();
                        draw();
                    }
                });
            })();
           
        }
    }
});