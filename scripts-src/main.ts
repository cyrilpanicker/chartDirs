// /// <reference path="typings/tsd.d.ts" />



interface IControllerScope extends ng.IScope{
    values:number[];
    changeValues:() => void;
}

angular.module('app',['chartDirs'])
.controller('Controller',($scope:IControllerScope,$interval) => {
    
    $scope.changeValues = () => {
        $scope.values = d3.range(10).map(() => Math.random()*1000);
    }
    
    $scope.changeValues();
    
})