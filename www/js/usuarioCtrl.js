/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, authService, usuarioFactory, cobroFactory, $window, $localStorage, $interval) {

    $scope.prestacionMP = {
        title: "",
        cant: 1.00,
        prec: 1.00
    };
    $scope.noticias = "";



    $scope.crearModalEnRunTime = function() {
        var elm = $("<ons-modal var=modal><ons-icon icon='ion-load-c' spin='true'></ons-icon><br><br>Aguarde...</ons-modal>");
        elm.appendTo($("body")); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object
    };

    $scope.initPoint = function() {
        //if ($scope.existenCredencialesMP()) {
            $scope.crearModalEnRunTime();
            $scope.modal.show();
            usuarioService.initPointMP($scope.prestacionMP.title, $scope.prestacionMP.cant, $scope.prestacionMP.prec, usuarioFactory.auth.access_token)
                    .then(function(data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            $scope.modal.hide();
                            cobroFactory.initPoint = data.contenido.initPoint;
                            cobroFactory.title = $scope.prestacionMP.title;
                            cobroFactory.cant = $scope.prestacionMP.cant;
                            cobroFactory.prec = $scope.prestacionMP.prec;
                            $scope.app.navigator.pushPage('confirmar.html');
                        } else {
                            $scope.modal.hide();
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                            });
                        }
                    })
                    .catch(function(data, status) {
                        $scope.modal.hide();
                        var mensaje = "No autorizado.";
                        switch (status) {
                            case 401:
                                mensaje = "No autorizado.";
                                break;
                        }
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                        });
                    });
//        } else {
//            $scope.ons.notification.alert({
//                title: 'Info',
//                messageHTML: '<strong style=\"color: #ff3333\">Primero debes obtener tus credenciales de MercadoPago para poder cobrar</strong>'
//            });
//        }
    };

    $scope.abrirInitiPoint = function() {
        $window.open(cobroFactory.initPoint, "_blank");
    };


    $scope.getCobroFactory = function() {
        return cobroFactory;
    };

    $scope.getUsuarioFactory = function() {
        return usuarioFactory;
    };

    $scope.getTituloMenu = function() {
        return usuarioFactory.tituloMenu;
    };

    $scope.formatDate = function(fecha) {
        var d = new Date(fecha);
        return d;
    };

    $scope.abrirMp = function() {
        //$window.open("https://auth.mercadopago.com.ar/authorization?client_id=4098737792138788&response_type=code&platform_id=mp&redirect_uri=https://www.aguraing.com.ar/cobroYa/ws/AuthCustomer.php", "_blank");
        $scope.app.navigator.pushPage("autorizar.html");
    };

    $scope.guardarCredencialesMP = function() {
        $localStorage.$reset();
        $localStorage.clientIdMp = usuarioFactory.clientIdMp;
        $localStorage.clientSecretMp = usuarioFactory.clientSecretMp;
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #ff3333\">Credenciales guardadas con exito</strong>',
            callback: function() {
                $scope.app.navigator.popPage();
            }
        });
    };

    $scope.borrarCredencialesMP = function() {
        $localStorage.$reset();
        usuarioFactory.clientIdMp = "";
        usuarioFactory.clientSecretMp = "";
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #ff3333\">Credenciales reseteadas con exito</strong>',
            callback: function() {
                $scope.app.navigator.popPage();
            }
        });
    };

    $scope.existenCredencialesMP = function() {
        if (typeof ($localStorage.clientIdMp) === "undefined")
            return false;
        if ($localStorage.clientIdMp === "") {
            return false;
        }
        return true;
    };

    $scope.loadIframe = function() {
        var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = $window[eventMethod];
        var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent, function(e) {
            if (e.data.respuesta === 'OK') {
                var contenido = angular.fromJson(e.data.contenido);
                usuarioFactory.auth = contenido;
                $interval(function() {
                    usuarioService.refreshAuth(usuarioFactory.auth.refresh_token)
                            .then(function(data) {
                                var respuesta = data.respuesta;
                                if (respuesta === 'OK') {
                                    usuarioFactory.auth = data.contenido;
                                    console.log(usuarioFactory.auth);
                                } else {
                                    $scope.modal.hide();
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                                    });
                                }
                            })
                            .catch(function(data, status) {
                                var mensaje = "No autorizado.";
                                switch (status) {
                                    case 401:
                                        mensaje = "No autorizado.";
                                        break;
                                }
                                //$scope.ons.notification.alert({
                                //    title: 'Info',
                                //    messageHTML: '<strong style=\"color: #ff3333\">Operación denegada: ' + mensaje + '</strong>'
                                //});
                            });
                }, contenido.expires_in);
            }
            //console.log('parent received message!:  ' +  e.data.contenido);
        }, false);
    };
    
    $scope.verContadorPrueba = function() {
        return authService.mostrarTimer();
    };

}


Onsen.controller('usuarioCtrl', function($scope, usuarioService, authService, usuarioFactory, cobroFactory, $window, $localStorage, $interval) {
    ons.ready(function() {
        usuarioFactory.clientIdMp = $localStorage.clientIdMp;
        usuarioFactory.clientSecretMp = $localStorage.clientSecretMp;
        authService.iniciarTimer();
    });
    usuarioCtrl($scope, usuarioService, authService, usuarioFactory, cobroFactory, $window, $localStorage, $interval);
});



