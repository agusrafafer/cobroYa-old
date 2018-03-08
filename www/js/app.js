/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//var Onsen = ons.bootstrap('Onsen', ['onsen']);

var Onsen = ons.bootstrap('Onsen', ['onsen', 'angular-websql', 'ngStorage', 'ngCardIO']);

//var Onsen = angular.module('Onsen', ['onsen', 'weatherModule', 'ngSanitize']);

Onsen.config(['$httpProvider', '$cordovaNgCardIOProvider', function ($httpProvider, $cordovaNgCardIOProvider) {
        // delete header from client:
        // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $cordovaNgCardIOProvider.setScanerConfig(
                {
                    "expiry": false,
                    "cvv": false,
                    "zip": false,
                    "suppressManual": true,
                    "suppressConfirm": false,
                    "hideLogo": true,
                    "scanInstructions": "Coloque la tarjeta en el recuadro verde y aguarde el escaneo"
                }
        );
        $cordovaNgCardIOProvider.setCardIOResponseFields(
                [
                    "card_type",
                    "redacted_card_number",
                    "card_number",
                    "expiry_month",
                    "expiry_year",
                    "short_expiry_year",
                    "cvv",
                    "zip"
                ]
                );
    }]);


Onsen.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});
