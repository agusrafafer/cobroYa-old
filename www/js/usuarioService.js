/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', ['$http', '$q', 'wsFactory', '$window', 'usuarioFactory', function ($http, $q, wsFactory, $window, usuarioFactory) {

//        var db = null;

        this.initPointMP = function (titleMp, cantMp, precMp, authToken) {
            //defered = diferido (asincrono)
            var defered = $q.defer();
            var promise = defered.promise;

            var parametros = 'title=' + titleMp + '&cant=' + cantMp + '&money=' + precMp + '&auth=' + authToken;
            $http.get(dS(wsFactory.l) + dS(wsFactory.i) + parametros)
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .error(function (data, status) {
                        defered.reject(data, status);
                    });

            return promise;
        };

        this.refreshAuth = function (refreshToken) {
            //defered = diferido (asincrono)
            var defered = $q.defer();
            var promise = defered.promise;
            var parametros = 'refreshToken=' + refreshToken;
            $http.get(dS(wsFactory.l) + dS(wsFactory.a) + parametros)
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .error(function (data, status) {
                        defered.reject(data, status);
                    });

            return promise;
        };

        this.redondearNumero = function (numero) {
            var decimals = 2;
            decimals = Math.pow(10, decimals);

            var intPart = Math.floor(numero);
            var fracPart = (numero % 1) * decimals;
            fracPart = fracPart.toFixed(0);

            if (fracPart > 50) {
                intPart += 1;
            }

            return intPart;
        };

        this.dSu = function (u) {
            return dS(u);
        };

        function dS(cd) {
            cd = decodeURIComponent(cd);
            var uc = '';
            var chr;
            for (var i = cd.length - 1; i >= 0; i--) {
                chr = cd.charAt(i);
                uc += (chr >= 'a' && chr <= 'z' || chr >= 'A' && chr <= 'Z') ?
                        String.fromCharCode(65 + wsFactory.k.indexOf(chr) % 26) :
                        chr;
            }
            return uc.toLowerCase();
        }
        ;


    }]);

