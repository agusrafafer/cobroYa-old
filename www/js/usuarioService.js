/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', function($http, $q, wsFactory) {

    this.initPointMP = function(clientIdMp, clientSecretMp, titleMp, cantMp, precMp) {
        //defered = diferido (asincrono)
        var defered = $q.defer();
        var promise = defered.promise;
        
        var parametros = 'cid=' + clientIdMp + '&secret=' + clientSecretMp + '&title=' + titleMp + '&cant=' + cantMp + '&money=' + precMp + '&sb=1';
        $http.get(wsFactory.url + 'InitPoint?' + parametros)
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

