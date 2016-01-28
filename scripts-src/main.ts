/// <reference path="typings/tsd.d.ts" />
/// <reference path="customTypes.d.ts" />

angular.module('app',['chartDirs'])
.controller('Controller',($scope:IControllerScope,$interval,$timeout:ng.ITimeoutService) => {
    
    var data = [
        {
            'device':'Desktops',
            'west':8,
            'central':5,
            'east':3
        },
        {
            'device':'Notebooks',
            'west':7,
            'central':6,
            'east':4
        },
        {
            'device':'AIO',
            'west':9,
            'central':7,
            'east':4
        },
        {
            'device':'Tablets',
            'west':6,
            'central':4,
            'east':2
        },
        {
            'device':'Phones',
            'west':10,
            'central':5,
            'east':3
        }
    ];
    
    $scope.data = data;
    
    $scope.keyConfig = {
        name:'device'
    };

    $scope.valuesConfig = [
        {
            name:'west',
            color:'#3232ff'
        },
        {
            name:'central',
            color:'#7f7fff'
        },
        {
            name:'east',
            color:'#ccccff'
        }
     ];
   
    $scope.changeValues = () => {
        if($scope.data.length === 5){
            $scope.data.push({
                'device':'Laptops',
                'west':6,
                'central':3,
                'east':2
            });
        }else{
            $scope.data.pop();
        }

    };
    
});

var data = [
    {
        department:'support',
        revenue:0.3
    }
    ,{
        department:'engineering',
        revenue:0.2
    }
    ,{
        department:'marketing',
        revenue:0.1
    }
];

var colorConfig = [
    {
        key:'support',
        fillColor:'yellow',
        strokeColor:'yellow'
    }
    ,{
        key:'engineering',
        fillColor:'red',
        strokeColor:'red'
    }
    ,{
        key:'support',
        fillColor:'blue',
        strokeColor:'blue'
    }
    ,{
        key:'support',
        fillColor:'green',
        strokeColor:'green'
    }
];

$(() => {
    d3.selectAll('.arc')
        .arcChart(data,'department','revenue',colorConfig,50,45);
});