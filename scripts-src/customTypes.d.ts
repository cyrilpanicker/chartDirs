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

interface IControllerScope extends ng.IScope{
    data:Data[];
    changeValues:() => void;
    valuesConfig:{}[];
    keyConfig:{};
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