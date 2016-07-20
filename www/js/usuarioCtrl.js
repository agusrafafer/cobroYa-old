/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, $window, $localStorage, $document) {

    $scope.prestacionMP = {
        title: "",
        cant: 1.00,
        prec: 1.00
    };
    $scope.noticias = "";



    $scope.crearModalEnRunTime = function () {
        var elm = $("<ons-modal var=modal><ons-icon icon='ion-load-c' spin='true'></ons-icon><br><br>Aguarde...</ons-modal>");
        elm.appendTo($("body")); // Insert to the DOM first
        ons.compile(elm[0]); // The argument must be a HTMLElement object
    };

    $scope.initPoint = function () {
        if ($scope.existeAutorizacionMP()) {
            $scope.verificarTTLAuth();
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Para poder operar primero debes obtener tu autorización de MercadoPago</strong>',
                callback: function () {
                    $scope.app.navigator.pushPage('autorizar.html');
                }
            });
        }
    };

    $scope.abrirInitiPoint = function () {
        $window.open(cobroFactory.initPoint, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
    };

    $scope.generarInitPoint = function () {
        usuarioService.initPointMP($scope.prestacionMP.title, $scope.prestacionMP.cant, $scope.prestacionMP.prec, usuarioFactory.auth.access_token)
                .then(function (data) {
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
                .catch(function (data, status) {
                    $scope.modal.hide();
                    var mensaje = "Excepción inesperada.";
                    switch (status) {
                        case 401:
                            mensaje = "No autorizado.";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">Error: ' + mensaje + '</strong>'
                    });
                });
    };

    $scope.verificarTTLAuth = function () {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        usuarioFactory.auth = $localStorage.auth;
        var expires_in = usuarioFactory.auth.expires_in;
        var now = Date.now();
        var authDate = $localStorage.authDate;
        var rest = now - authDate;

        //La fecha actual - la fecha en que guarde la autorizacion
        //debe ser menor sino debo volver a solicitar el token
        //mediante el refresh 
        if (rest > expires_in) {
            usuarioService.refreshAuth(usuarioFactory.auth.refresh_token)
                    .then(function (data) {
                        var respuesta = data.respuesta;
                        if (respuesta === 'OK') {
                            usuarioFactory.auth = angular.fromJson(data.contenido);
                            $scope.guardarAutorizacionMP();
                            //Aqui se genera realmente el initpoint
                            $scope.generarInitPoint();
                        } else {
                            $scope.modal.hide();
                            var mensaje = "No se pudo generar la autorización de MercadoPago";
                            $scope.ons.notification.alert({
                                title: 'Info',
                                messageHTML: '<strong style=\"color: #ff3333\">Error: ' + mensaje + '</strong>'
                            });
                        }
                    })
                    .catch(function (data, status) {
                        $scope.modal.hide();
                        var mensaje = "Excepción inesperada.";
                        switch (status) {
                            case 401:
                                mensaje = "No autorizado.";
                                break;
                        }
                        $scope.ons.notification.alert({
                            title: 'Info',
                            messageHTML: '<strong style=\"color: #ff3333\">Error: ' + mensaje + '</strong>'
                        });
                    });

        } else {
            //Aqui se genera realmente el initpoint
            $scope.generarInitPoint();
        }
    };

    $scope.getCobroFactory = function () {
        return cobroFactory;
    };

    $scope.getUsuarioFactory = function () {
        return usuarioFactory;
    };

    $scope.getTituloMenu = function () {
        return usuarioFactory.tituloMenu;
    };

    $scope.formatDate = function (fecha) {
        var d = new Date(fecha);
        return d;
    };

    $scope.abrirMp = function () {
        $scope.app.navigator.pushPage("autorizar.html");
    };

    $scope.guardarAutorizacionMP = function () {
        $localStorage.$reset();
        $localStorage.auth = usuarioFactory.auth;
        $localStorage.authDate = Date.now();
    };

    $scope.borrarAutorizacionMP = function () {
        $localStorage.$reset();
        usuarioFactory.auth = "";
    };

    $scope.existeAutorizacionMP = function () {
        if (typeof ($localStorage.auth) === "undefined")
            return false;
        if ($localStorage.auth === "") {
            return false;
        }
        return true;
    };

    $scope.loadIframeMP = function () {
        if (!$scope.existeAutorizacionMP()) {

            var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = $window[eventMethod];
            var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

            //Escuchando el mensaje enviado desde la pagina contenida en el iframe
            //que devuelve la autorizacion de mercaopago
            eventer(messageEvent, function (e) {
                if (e.data.respuesta === 'OK') {
                    var contenido = angular.fromJson(e.data.contenido);
                    usuarioFactory.auth = contenido;
                    usuarioService.refreshAuth(usuarioFactory.auth.refresh_token)
                            .then(function (data) {
                                var respuesta = data.respuesta;
                                if (respuesta === 'OK') {
                                    usuarioFactory.auth = angular.fromJson(data.contenido);
                                    $scope.guardarAutorizacionMP();

//                                    var articleRow = angular.element($document[0].querySelector('#divAvisoIni'));
//                                    articleRow.remove();

                                } else {
                                    $scope.ons.notification.alert({
                                        title: 'Info',
                                        messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
                                    });
                                }
                            })
                            .catch(function (data, status) {
                                var mensaje = "Excepción inesperada.";
                                switch (status) {
                                    case 401:
                                        mensaje = "No autorizado.";
                                        break;
                                }
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #ff3333\">Error: ' + mensaje + '</strong>'
                                });
                            });
                }
            }, false);
        }
    };

    $scope.abrirAguraIng = function () {
        $window.open("http://www.agura.com.ar", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
    };

    $scope.verTerminosYcondiciones = function () {
        $scope.app.navigator.pushPage("terminosCondiciones.html");
    };

    $scope.verPoliticas = function () {
        $scope.app.navigator.pushPage("politicas.html");
    };

}


Onsen.controller('usuarioCtrl', ['$scope', 'usuarioService', 'usuarioFactory', 'cobroFactory', '$window', '$localStorage', '$document', function ($scope, usuarioService, usuarioFactory, cobroFactory, $window, $localStorage, $document) {
        ons.ready(function () {
            usuarioFactory.clientIdMp = $localStorage.clientIdMp;
            usuarioFactory.clientSecretMp = $localStorage.clientSecretMp;
            //authService.iniciarTimer();
        });
        usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, $window, $localStorage, $document);
    }]);



