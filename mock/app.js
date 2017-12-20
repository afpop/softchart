angular.module('todoApp', ['softchart.directive'])
    .controller('TodoListController', function() {

        var vm = this;


        vm.setup = {};
        vm.setup.type = 'bar';
        vm.setup.stackY = true;
        vm.setup.stackX = true;
        vm.setup.showLabel = { enabled: true, type: "H" };

        vm.label = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

        vm.dataset = [
            {
                label: '# of Votes',
                data: [12.1, 19.5, 3.3, 5.9, 2.7, 3.2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ]
            }
        ];
    });