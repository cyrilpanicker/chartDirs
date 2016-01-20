/// <reference path="typings/tsd.d.ts" />
/// <reference path="customTypes.d.ts" />
angular.module('chartDirs')
.directive('barChart',() => {

    return {

        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes:BarChartAttributes) => {
            
            var attributeList = [
                'data',
                'keyConfig',
                'valuesConfig',
                'width',
                'height',
                'padding',
                'stackOrientation',
                'orientation'
            ];
            
            var data:{}[],
                keyProperty:string,
                valueProperties:ValueProperty[],
                maxValue:number,
                width:number,
                height:number,
                padding:number,
                stackOrientation:string,
                orientation:string,
                valueScale:d3.scale.Linear<number,number>,
                barGroupScale:d3.scale.Ordinal<string,number>,
                barScale:d3.scale.Ordinal<string,number>;
                
            keyProperty = JSON.parse(attributes.keyConfig).name;
            valueProperties = JSON.parse(attributes.valuesConfig);
            width = parseFloat(attributes.width)
            height = parseFloat(attributes.height);
            padding = parseFloat(attributes.padding);
            stackOrientation = attributes.stackOrientation;
            orientation = attributes.orientation;
            
            var updateData = () => {

                data = JSON.parse(attributes.data);

                maxValue = d3.max(valueProperties.map((valueProperty) => {
                    return d3.max(data,(datum) => {
                        return datum[valueProperty.name];
                    });
                }));

                valueScale = d3.scale.linear();
                if(orientation === 'horizontal'){
                    valueScale.domain([0,maxValue]).range([0,width]);
                }else if(orientation === 'vertical'){
                    valueScale.domain([maxValue,0]).range([0,height]);
                }

                barGroupScale = d3.scale.ordinal<string,number>();
                if(orientation === 'horizontal'){
                    barGroupScale
                        .domain(data.map(datum => {
                            return datum[keyProperty];
                        }))
                        .rangeBands([0,height],padding);
                }else if(orientation === 'vertical'){
                    barGroupScale
                        .domain(data.map(datum => {
                            return datum[keyProperty];
                        }))
                        .rangeBands([0,width],padding);
                }


                if(stackOrientation === 'behind'){
                    barScale = barGroupScale;
                } else if(stackOrientation === 'side'){
                    barScale = d3.scale.ordinal()
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
                if(stackOrientation === 'behind'){
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
            
            var svgElement = d3.select(element[0]).append('svg')
                .attr('width',width)
                .attr('height',height);

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
            
            var emptyAttributeExists = () => {
                return attributeList.some((attribute) => {
                    return attributes[attribute] === '';
                })
            };
            
            attributes.$observe('data',() => {
                if(!emptyAttributeExists()){
                    updateData();
                    draw();
                }
            });
           
        }
    }
});