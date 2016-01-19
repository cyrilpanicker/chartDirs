// /// <reference path="typings/tsd.d.ts" />
angular.module('app', ['chartDirs'])
    .controller('Controller', function ($scope, $interval) {
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
            'central': 2,
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
            'central': 2,
            'east': 2
        },
        {
            'device': 'Phones',
            'west': 2,
            'central': 1,
            'east': 5
        },
        {
            'device': 'A',
            'west': 7,
            'central': 2,
            'east': 2
        },
        {
            'device': 'B',
            'west': 2,
            'central': 1,
            'east': 5
        },
        {
            'device': 'C',
            'west': 7,
            'central': 2,
            'east': 2
        },
        {
            'device': 'D',
            'west': 7,
            'central': 2,
            'east': 2
        },
        {
            'device': 'E',
            'west': 4,
            'central': 6,
            'east': 4
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
        if ($scope.valuesConfig == valuesConfigurations[0]) {
            $scope.valuesConfig = valuesConfigurations[1];
        }
        else if ($scope.valuesConfig == valuesConfigurations[1]) {
            $scope.valuesConfig = valuesConfigurations[2];
        }
        else if ($scope.valuesConfig == valuesConfigurations[2]) {
            $scope.valuesConfig = valuesConfigurations[0];
        }
    };
});
