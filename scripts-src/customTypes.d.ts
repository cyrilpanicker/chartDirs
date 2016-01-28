/// <reference path="typings/tsd.d.ts" />

interface IBarChartScope extends ng.IScope{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    width:string;
    height:string;
    padding:string;
}

interface ValueProperty{
    name:string;
    color:string;
}

interface BarChartAttributes extends ng.IAttributes{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    width:string;
    height:string;
    padding:string;
    type:string;
    orientation:string;
}

interface LineChartAttributes extends ng.IAttributes{
    data:string;
    keyConfig:string;
    valuesConfig:string;
    width:string;
    height:string;
    type:string;
    curveTension:string;
    padding:string;
}

interface ArcChartAttributes extends ng.IAttributes{
    data:string;
    keyProperty:string;
    valueProperty:string;
    width:string;
    colorConfig:string;
    innerRadius:string;
}

interface IControllerScope extends ng.IScope{
    data:Data[];
    changeValues:() => void;
    valuesConfig:{}[];
    keyConfig:{};
    arcChartData:{}[];
    arcChartColorConfig:{}[];
}

interface Data{
    device:string;
    west:number;
    east:number;
    central:number;
}

interface KeyConfig{
    name:string;
}

interface ValueConfig{
    name:string;
    color:string;
}

interface arcDatum{
    angles:number[]
}

interface colorConfig{
    key:string;
    fillColor:string;
    strokeColor:string;
}