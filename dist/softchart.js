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
                var myChart;

                if(scope.setup)
                {
                    if(!scope.setup.type)
                        scope.setup.type = 'bar';

                    if(scope.setup.stackX !== true)
                        scope.setup.stackX = false;

                    if(scope.setup.stackY !== true)
                        scope.setup.stackY = false;

                    if(!scope.setup.showLabel)
                    {
                        scope.setup.showLabel = {};
                        scope.setup.showLabel.enabled = false;
                    }
                }
                else
                {
                    scope.setup = {};
                    scope.setup.type = 'bar';
                    scope.setup.showLabel = {};
                    scope.setup.showLabel.enabled = false;
                }

                $timeout(_createGraph, 200); // da tempo do angular setar o id do canvas

                function _createGraph(){

                    if(!first)
                        myChart.destroy();

                    //pega o canvas
                    var ctxa = document.getElementById(scope.id);

                    var ctx = ctxa.getContext('2d');

                    myChart = new Chart(ctx, {
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
                            },
                            plugins: {
                                datalabels: {
                                    display: scope.setup.showLabel.enabled,
                                    formatter: _format
                                }
                            }
                        }
                    });

                    first = false;
                }

                function _format(value, context){

                    if(scope.setup.showLabel.enabled){

                        if(scope.setup.showLabel.type === "%"){
                            return Math.round(value*100) + '%';
                        }
                        else if(scope.setup.showLabel.type === "H"){

                            var h = Math.trunc(value);

                            var m = Math.ceil((value - h) * 10);
                            h = m >= 60 ? h + 1 : h;
                            m = m * 6;
                            m = m >= 60 ? 0 : m;
                            m = m < 10 ? '0' + m : m;
                            h = h < 10 ? '0' + h : h;

                            return h + ":" + m;
                        }
                        else
                            return value;
                    }

                }

                scope.$watch('dataset', function (){

                    if(!first)
                        _createGraph();

                });
            }
        };

    }

})();

angular.module('softchart.directive').run(['$templateCache', function($templateCache) {$templateCache.put('softchart.html','\n<div class="softchart">\n\n    <canvas ng-attr-id="{{::id}}"></canvas>\n\n</div>\n');}]);