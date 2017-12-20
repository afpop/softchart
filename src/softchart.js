(function () {
    'use strict';

    angular.module('softchart.directive', [])
        .directive('softchart', softChart);

    softChart.$injector = ['$filter','$timeout'];

    /** @ngInject */
    function softChart($filter, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                id: "=",
                setup: "=",
                dataset: "=",
                label: "="
            },
            templateUrl: "softchart.html",
            link: function (scope, element, attrs) {

                var first = true;

                if(scope.setup)
                {
                    if(!scope.setup.type)
                        scope.setup.type = 'bar';

                    if(scope.setup.stackX !== true)
                        scope.setup.stackX = false;

                    if(scope.setup.stackY !== true)
                        scope.setup.stackY = false;
                }
                else
                {
                    scope.setup = {};
                    scope.setup.type = 'bar';
                    scope.setup.stack = false;
                }

                $timeout(_createGraph, 200); // da tempo do angular setar o id do canvas

                function _createGraph(){

                    //pega o canvas
                    var ctxa = document.getElementById(scope.id);

                    var ctx = ctxa.getContext('2d');

                    var myChart = new Chart(ctx, {
                        type: scope.setup.type,
                        data: {
                            labels: scope.label,
                            datasets: scope.dataset
                        },
                        options: {
                            scales: {
                                responsive: true,
                                xAxes: [{
                                    stacked: scope.setup.stackX
                                }],
                                yAxes: [{
                                    stacked: scope.setup.stackY,
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            }
                        }
                    });

                    first = false;
                }

                scope.$watch('dataset', function (){

                    if(!first)
                        _createGraph();

                });
            }
        };

    }

})();
