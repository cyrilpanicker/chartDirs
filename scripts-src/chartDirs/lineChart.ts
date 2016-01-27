/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../customTypes.d.ts" />

angular.module('chartDirs')
.directive('lineChart',() => {
    return {
        link:(scope:IBarChartScope, element:ng.IAugmentedJQuery, attributes:LineChartAttributes) => {
            
            var data:{}[];
            var height:number;
            var width:number;
            var type:string;
            var curveTension:number;
            var padding:number;
            var keyProperty:string;
            var valueProperties:ValueProperty[];
            
            var assignWidthAndHeightProperties = () => {
                height = parseFloat(attributes.height);
                width = parseFloat(attributes.width);
                if(isNaN(height)){
                     throw 'empty or invalid height provided';
                }
                if(isNaN(width)){
                    throw 'empty or invalid width provided';
                }
            };
            
            var assignOptionalProperties = () => {
                padding = !attributes.padding || isNaN(parseFloat(attributes.padding)) ? 0 :  parseFloat(attributes.padding);
                type = !attributes.type || ['linear','cardinal'].indexOf(attributes.type) === -1 ? 'linear' : attributes.type;
                curveTension = !attributes.curveTension || isNaN(parseFloat(attributes.curveTension)) ? 0.75 :  parseFloat(attributes.curveTension);                
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
            
            var updateData = () => {
                try{
                    data = JSON.parse(attributes.data);
                    if(!Array.isArray(data)){
                        throw '"data" should be an array';
                    }
                    var properties = valueProperties.map(valueProperty => valueProperty.name).concat(keyProperty);
                    if(!data.every(datum => {
                        return properties.every(property => {
                            return property in datum;
                        });
                    })){
                        throw '"property-value" pair missing in "data"';
                    }
                }catch(exception){
                    throw 'invalid "data" provided : \n'+exception;
                }
            };
            
            (function(){

                assignWidthAndHeightProperties();
                assignOptionalProperties();
                assignKeyProperty();
                assignValueProperties();

                attributes.$observe('data',() => {
                    if(attributes.data){
                        updateData();
                        d3.select(element[0]).lineChart(
                            data,
                            keyProperty,
                            valueProperties,
                            width,
                            height,
                            padding,                            
                            type,
                            curveTension
                        );
                    }
                });

            })();
            
        }
    };
});