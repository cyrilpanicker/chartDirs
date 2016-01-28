/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />

angular.module('chartDirs')
.directive('arcChart',() => {
    return {
        
        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes:ArcChartAttributes) => {
            
            var data:{}[];
            var keyProperty:string;
            var valueProperty:string;
            var colorConfig:colorConfig[];
            var outerRadius:number;
            var innerRadius:number;
            
            var assignOuterRadius = () => {
                var width = parseFloat(attributes.width);
                if(isNaN(width)){
                    throw 'empty or invalid "width" provided';
                }
                outerRadius = width/2;
            };
            
            var assignInnerRadius = () => {
                innerRadius = !attributes.innerRadius || isNaN(parseFloat(attributes.innerRadius)) ? 0 : parseFloat(attributes.innerRadius);
            };
            
            var assignKeyValueProperties = () => {
                if(!attributes.keyProperty){
                    throw 'empty "key-property" provided';
                }
                keyProperty = attributes.keyProperty;
                if(!attributes.valueProperty){
                    throw 'empty "value-property" provided';
                }
                valueProperty = attributes.valueProperty;
            };
            
            var assignColorConfig = () => {
                try{
                    if(!attributes.colorConfig){
                        throw 'empty "color-config" provided';
                    }
                    colorConfig = JSON.parse(attributes.colorConfig);
                    if(!Array.isArray(colorConfig)){
                        throw '"color-config" should be an array';
                    }
                    if(!colorConfig.every((configDatum) => {
                        return !!(configDatum.key && configDatum.fillColor && configDatum.strokeColor);
                    })){
                        throw 'invalid data in "color-config"';
                    }
                }catch(exception){
                    throw 'empty or invalid "color-config" provided : \n'+exception;
                }
            };
            
            var updateData = () => {
                try{
                    data = JSON.parse(attributes.data);
                    if(!Array.isArray(data)){
                        throw '"data" should be an array';
                    }
                    if(!data.every(datum => {
                        return datum[keyProperty] && angular.isDefined(datum[valueProperty]);
                    })){
                        throw 'property missing in "data"';
                    }
                }catch(exception){
                    throw 'invalid "data" provided : \n'+exception;
                }
            };
            
            (function(){
                
                assignOuterRadius();
                assignInnerRadius();
                assignKeyValueProperties();
                assignColorConfig();
                
                attributes.$observe('data',() => {
                    if(attributes.data){
                        updateData();
                        d3.select(element[0]).arcChart(
                            data,
                            keyProperty,
                            valueProperty,
                            colorConfig,
                            outerRadius,
                            innerRadius
                        );
                    }
                });
                
            })();
            
        }
        
    };
});