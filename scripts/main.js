// /// <reference path="typings/tsd.d.ts" />
angular.module('app', ['chartDirs'])
    .controller('Controller', function ($scope, $interval, $timeout) {
    var data = [
        {
            'device': 'Desktops',
            'west': 5,
            'central': 2,
            'east': 3
        },
        {
            'device': 'Notebooks',
            'west': 3,
            'central': 5,
            'east': 4
        },
        {
            'device': 'AIO',
            'west': 4,
            'central': 3,
            'east': 4
        },
        {
            'device': 'Tablets',
            'west': 7,
            'central': 6,
            'east': 2
        },
        {
            'device': 'Phones',
            'west': 2,
            'central': 1,
            'east': 5
        }
    ];
    $scope.data = data;
    $scope.keyConfig = {
        name: 'device'
    };
    var valuesConfigurations = [
        [
            {
                name: 'west',
                color: 'blue'
            },
            {
                name: 'east',
                color: 'yellow'
            },
            {
                name: 'central',
                color: 'red'
            },
        ],
        [
            {
                name: 'west',
                color: 'blue'
            },
            {
                name: 'central',
                color: 'red'
            }
        ],
        [{
                name: 'east',
                color: 'red'
            }]
    ];
    $scope.valuesConfig = valuesConfigurations[0];
    $scope.changeValues = function () {
        $scope.data.push({
            'device': 'Laptops',
            'west': 6,
            'central': 1,
            'east': 2
        });
    };
});
