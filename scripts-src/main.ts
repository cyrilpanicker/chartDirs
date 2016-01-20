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

    var valuesConfigurations = [
        [
            {
                name:'west',
                color:'blue'
            },
            {
                name:'central',
                color:'red'
            },
            {
                name:'east',
                color:'yellow'
            },

        ],
        [
            {
                name:'west',
                color:'blue'
            },
            {
                name:'central',
                color:'red'
            }
        ],
        [{
            name:'east',
            color:'red'
        }]
    ];
    
    $scope.valuesConfig = valuesConfigurations[0];
   
    $scope.changeValues = () => {
        $scope.data.push({
            'device':'Laptops',
            'west':6,
            'central':3,
            'east':2
        });
    };
    
});