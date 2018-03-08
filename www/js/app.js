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
                    "expiry": true,
                    "cvv": true,
                    "zip": false,
                    "suppressManual": false,
                    "suppressConfirm": false,
                    "hideLogo": true
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
