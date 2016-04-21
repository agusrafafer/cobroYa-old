/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', function($http, $q, wsFactory) {

    this.initPointMP = function(titleMp, cantMp, precMp, authToken) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        
        var parametros = 'title=' + titleMp + '&cant=' + cantMp + '&money=' + precMp + '&auth=' + authToken;
        console.log(wsFactory.url + 'InitPoint.php?' + parametros);
        $http.get(wsFactory.url + 'InitPoint.php?' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };  
    
    this.refreshAuth = function(refreshToken) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        var parametros = 'refreshToken=' + refreshToken;
        //$http.post(wsFactory.url + 'AuthCustomer.php', {refreshToken: refreshToken})
        $http.get(wsFactory.url + 'AuthCustomer.php?' + parametros)
                .success(function(data) {
                    defered.resolve(data);
                })
                .error(function(data, status) {
                    defered.reject(data, status);
                });

        return promise;
    };

    this.redondearNumero = function(numero) {
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

});

