// /// <reference path="typings/tsd.d.ts" />
angular.module('app', ['chartDirs'])
    .controller('Controller', function ($scope, $interval) {
    $scope.changeValues = function () {
        $scope.values = d3.range(10).map(function () { return Math.random() * 1000; });
    };
    $scope.changeValues();
});
