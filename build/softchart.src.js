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

                    if(!scope.setup.axes){
                        scope.setup.axes = {x: true, y: true};
                    }

                    if(!scope.setup.legend)
                        scope.setup.legend = { enabled: true };
                }
                else
                {
                    scope.setup = {};
                    scope.setup.type = 'bar';
                    scope.setup.showLabel = {};
                    scope.setup.showLabel.enabled = false;
                    scope.setup.axes = {x: true, y: true};
                    scope.setup.legend = { enabled: true };
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
                            onClick: _callback,
                            scales: {
                                responsive: true,
                                xAxes: [{
                                    display: scope.setup.axes.x,
                                    stacked: scope.setup.stackX,
                                    ticks:{
                                        autoSkip: false
                                    }
                                }],
                                yAxes: [{
                                    display: scope.setup.axes.y,
                                    stacked: scope.setup.stackY,
                                    ticks: {
                                        max: scope.setup.maxY ? scope.setup.maxY : undefined,
                                        beginAtZero: true,
                                        callback: function(value, index, values){
                                            return _format(value);
                                        }
                                    }
                                }]
                            },
                            plugins: {
                                datalabels: {
                                    display: scope.setup.showLabel.enabled,
                                    formatter: _format,
                                    color: "black",
                                    anchor: "center"
                                }
                            },
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {

                                        if(scope.setup.type == "pie"){
                                            return data.datasets[tooltipItem.datasetIndex].label + ": " + _format(data.datasets[0].data[tooltipItem.index]);
                                        }
                                        else
                                            return data.datasets[tooltipItem.datasetIndex].label + ": " + _format(tooltipItem.yLabel);

                                    }
                                }
                            },
                            legend: {
                                display: scope.setup.legend.enabled
                            }
                        }
                    });

                    first = false;
                }

                function _callback(event, item){

                    if(scope.setup.callback)
                    {
                        if(item.length > 0)
                        {
                            scope.setup.callback(
                                {
                                    index: item[0]._index,
                                    label: item[0]._model.label,
                                    labelIndex: scope.label[item[0]._index]
                                }
                            );
                        }
                    }
                }

                function _format(value, context){

                        if(scope.setup.showLabel.type === "%"){
                            return Math.round(value) + '%';
                        }
                        else if(scope.setup.showLabel.type === "H"){

                            if(value <= 0)
                                return "";

                            var hours = Math.floor(value);
                            var minutes = Math.round(value * 60 % 60, -1);
                            if(minutes >= 60){
                                minutes =  0;
                                hours++;
                            }

                            hours = hours < 10 ? "0" + hours : hours;
                            minutes = minutes < 10 ? "0" + minutes : minutes;
                            return hours + ":" + minutes;
                        }
                        else
                            return value;
                }

                scope.$watch('dataset', function (){

                    if(!first)
                        _createGraph();

                });
            }
        };

    }

})();
