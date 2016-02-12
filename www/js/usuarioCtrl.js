/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Onsen.controller('usuarioCtrl', function($rootScope, $scope, $http) {
//    usuarioCtrl($rootScope, $scope, $http);
//});


//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, noticiaService, $window, $localStorage) {

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
        if ($scope.existenCredencialesMP()) {
            $scope.crearModalEnRunTime();
            $scope.modal.show();
            usuarioService.initPointMP(usuarioFactory.clientIdMp, usuarioFactory.clientSecretMp, $scope.prestacionMP.title, $scope.prestacionMP.cant, $scope.prestacionMP.prec)
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
        } else {
            $scope.ons.notification.alert({
                title: 'Info',
                messageHTML: '<strong style=\"color: #ff3333\">Primero debes obtener tus credenciales de MercadoPago para poder cobrar</strong>'
            });
        }
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
        //$window.open("https://www.mercadopago.com/mla/herramientas/aplicaciones", "_blank");
        $scope.app.navigator.pushPage("credenciales.html");
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

    $scope.abrirNoticia = function(link) {
        $window.open(link, "_blank");
    };

    $scope.proximamente = function() {
        $scope.ons.notification.alert({
            title: 'Info',
            messageHTML: '<strong style=\"color: #25a6d9\">Proximamente</strong>'
        });
    };


    cargarNoticias();

    function cargarNoticias() {
        var ancho = ($($window).width() / 2) - 150;
        ancho = ancho + "px";
        $("#clima").css({"margin-left": ancho});
        noticiaService.noticiasRss().success(function(data) {
            var x2js = new X2JS();
            if ($scope.noticias === "") {
                $scope.noticias = x2js.xml_str2json(data);
                $scope.noticias = $scope.noticias.rss.channel.item;
                $scope.noticias = $scope.noticias.slice(0, 3);
            }
        });
    }
    ;

}


Onsen.controller('usuarioCtrl', function($scope, usuarioService, usuarioFactory, cobroFactory, noticiaService, $window, $localStorage) {
    ons.ready(function() {
        usuarioFactory.clientIdMp = $localStorage.clientIdMp;
        usuarioFactory.clientSecretMp = $localStorage.clientSecretMp;
    });
    usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, noticiaService, $window, $localStorage);
});



