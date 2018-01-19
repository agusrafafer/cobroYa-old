//El controlador de usuarios
function usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, $window, $webSql, $sce, $localStorage) {

    $scope.db = $webSql.openDatabase('dbmeliauth', '1.0', 'dbmeliauth', 2 * 1024 * 1024);

    $scope.prestacionMP = {
        title: "",
        cant: 1.00,
        prec: 1.00
    };
    $scope.noticias = "";

    $scope.fingerPrint = "";

    $scope.dml = $sce.trustAsResourceUrl(usuarioService.dSu('gng.lLxHpQNtnBNS%2Fdi%2FjEwlhwt%2FVHt.pOjTkmj.iAA%2F%2F%3AQJppD%3DOlN_BtLlOWLl%26JV%3DyO_VTHqpjIg%26LyHt%3DbgEB_bQsHJQbl%268878312977378904%3DWO_BULcIG%3FswcpSRclwDBNS%2Flj.VwG.wmjJHWjtlLx.nBkj%2F%2F%3AQJppn'));

    $scope.hoy = new Date();


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
        $window.open(cobroFactory.initPoint, "_blank", "location=no,clearsessioncache=yes,clearcache=yes,EnableViewPortScale=yes");
    };

    $scope.abrirAutorizacionMP = function () {
        var win = $window.open($scope.dml, "_blank", "location=no,EnableViewPortScale=yes");

        win.addEventListener("loadstop", function () {

            // Clear out the name in localStorage for subsequent opens.
            win.executeScript({code: "$localStorage.setItem( 'responseWs', '' );"});

            // Start an interval
            var loop = setInterval(function () {

                // Execute JavaScript to check for the existence of a name in the
                // child browser's localStorage.
                win.executeScript(
                        {
                            code: "$localStorage.getItem( 'responseWs' )"
                        },
                        function (values) {
                            var respuesta = values[0];
                            // If a response was set, clear the interval and close the InAppBrowser.
                            if (respuesta) {
                                var respJson = JSON.parse(respuesta);
                                usuarioFactory.auth = angular.fromJson(respJson.contenido);
                                $scope.guardarAutorizacionMP();
                                $scope.ons.notification.alert({
                                    title: 'Info',
                                    messageHTML: '<strong style=\"color: #ff3333\">Guardo?</strong>'
                                });
                                win.close();
                                clearInterval(loop);
                            }
                        }
                );
            });
        });

//        win.addEventListener("exit", function () {
//            win.executeScript(
//                    {
//                        code: "localStorage.getItem( 'responseWs' )"
//                    },
//                    function (values) {
//                        var respuesta = values[0];
//                        // If a response was set, clear the interval and close the InAppBrowser.
//                        if (respuesta) {
//                            var respJson = JSON.parse(respuesta);
//                            usuarioFactory.auth = angular.fromJson(respJson.contenido);
//                            $scope.guardarAutorizacionMP();
//                            //clearInterval(loop);
//                            win.close();
//                        }
//                    }
//            );
//
//        });

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
                    var mensaje = "Autorización vencida";
                    switch (status) {
                        case 401:
                            mensaje = "Al parecer tu último cobro ocurrio hace mucho tiempo. Por favor vuelve a pedir autorización a MercadoPago";
                            break;
                    }
                    $scope.ons.notification.alert({
                        title: 'Info',
                        messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>',
                        callback: function () {
                            $scope.borrarAutorizacionMP();
                            $scope.app.navigator.pushPage('autorizar.html');
                        }
                    });
                });
    };

    $scope.verificarTTLAuth = function () {
        $scope.crearModalEnRunTime();
        $scope.modal.show();
        $scope.db.selectAll("authmeli").then(function (results) {
            var id = -1;
            var auth = "";
            var dateAuth = -1;
            if (results.rows.length > 0) {
                id = results.rows.item(0).id;
                auth = JSON.parse(results.rows.item(0).auth);
                dateAuth = results.rows.item(0).dateAuth;
            }
            usuarioFactory.idAuth = id;
            usuarioFactory.auth = auth;
            usuarioFactory.authDate = dateAuth;
            var expires_in = usuarioFactory.auth.expires_in;
            var now = Date.now();
            var rest = now - dateAuth;

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
                            var mensaje = "Problemas de conectividad";
                            switch (status) {
                                case 401:
                                    mensaje = "Problemas de conectividad con el servidor";
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
        });
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
        $scope.db.selectAll("authmeli").then(function (results) {
            var id = -1;
            if (results.rows.length > 0) {
                id = results.rows.item(0).id;
                usuarioFactory.idAuth = id;
                $scope.db.update("authmeli", {"auth": JSON.stringify(usuarioFactory.auth), "authDate": Date.now()}, {
                    'id': id
                });
            } else {
                $scope.db.insert('authmeli', {"auth": JSON.stringify(usuarioFactory.auth), "authDate": Date.now()}).then(function (results) {
                    usuarioFactory.idAuth = 0;
                });
            }
        });

    };

    $scope.borrarAutorizacionMP = function () {
        $scope.db.del("authmeli", {"id": usuarioFactory.idAuth});
        usuarioFactory.auth = {};
        usuarioFactory.idAuth = -1;
        usuarioFactory.authDate = -1;
    };

    $scope.existeAutorizacionMP = function () {
        if (usuarioFactory.idAuth === -1) {
            return false;
        }
        return true;
    };

//    $scope.loadIframeMP = function () {
//        if (!$scope.existeAutorizacionMP()) {
//
//            var eventMethod = $window.addEventListener ? "addEventListener" : "attachEvent";
//            var eventer = $window[eventMethod];
//            var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
//
//            //Escuchando el mensaje enviado desde la pagina contenida en el iframe
//            //que devuelve la autorizacion de mercaopago
//            eventer(messageEvent, function (e) {
//                if (e.data.respuesta === 'OK') {
//                    var contenido = angular.fromJson(e.data.contenido);
//                    usuarioFactory.auth = contenido;
//                    usuarioService.refreshAuth(usuarioFactory.auth.refresh_token)
//                            .then(function (data) {
//                                var respuesta = data.respuesta;
//                                if (respuesta === 'OK') {
//                                    usuarioFactory.auth = angular.fromJson(data.contenido);
//                                    $scope.guardarAutorizacionMP();
//
////                                    var articleRow = angular.element($document[0].querySelector('#divAvisoIni'));
////                                    articleRow.remove();
//
//                                } else {
//                                    $scope.ons.notification.alert({
//                                        title: 'Info',
//                                        messageHTML: '<strong style=\"color: #ff3333\">' + data.contenido + '</strong>'
//                                    });
//                                }
//                            })
//                            .catch(function (data, status) {
//                                var mensaje = "Problemas de conectividad";
//                                switch (status) {
//                                    case 401:
//                                        mensaje = "Problemas de conectividad con el servidor";
//                                        break;
//                                }
//                                $scope.ons.notification.alert({
//                                    title: 'Info',
//                                    messageHTML: '<strong style=\"color: #ff3333\">' + mensaje + '</strong>'
//                                });
//                            });
//                }
//            }, false);
//        }
//    };

    $scope.abrirRegMP = function () {
        $window.open("https://registration.mercadopago.com.ar/registration-mp?mode=mp", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
    };

    $scope.abrirTermMP = function () {
        $window.open("https://www.mercadopago.com.ar/ayuda/terminos-y-condiciones_299", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
    };

    $scope.verTerminosYcondiciones = function () {
        $scope.app.navigator.pushPage("terminosCondiciones.html");
    };

    $scope.verPoliticas = function () {
        $scope.app.navigator.pushPage("politicas.html");
    };

    $scope.salir = function () {
        $scope.ons.notification.confirm({
            message: '¿Seguro deseas salir de CobroYa?',
            buttonLabels: ['No', 'Si'],
            title: 'Info',
            callback: function (idx) {
                switch (idx) {
                    case 0:
                        // Presiono No
//                        $scope.modal.hide();
                        break;
                    case 1:
                        navigator.app.exitApp();
                        break;
                }
            }
        });
    };

}
;


Onsen.controller('usuarioCtrl', ['$scope', 'usuarioService', 'usuarioFactory', 'cobroFactory', '$window', '$webSql', '$sce', '$localStorage', function ($scope, usuarioService, usuarioFactory, cobroFactory, $window, $webSql, $sce, $localStorage) {
        ons.ready(function () {
            $scope.db.createTable('authmeli', {
                "id": {
                    "type": "INTEGER",
                    "null": "NOT NULL", // default is "NULL" (if not defined)
                    "primary": true, // primary
                    "auto_increment": true // auto increment
                },
                "auth": {
                    "type": "TEXT",
                    "null": "NOT NULL"
                },
                "authDate": {
                    "type": "INTEGER"
                }
            });

            $scope.db.selectAll("authmeli").then(function (results) {
                var id = -1;
                var auth = "";
                var dateAuth = -1;
                if (results.rows.length > 0) {
                    id = results.rows.item(0).id;
                    auth = JSON.parse(results.rows.item(0).auth);
                    dateAuth = results.rows.item(0).authDate;
                }
                usuarioFactory.idAuth = id;
                usuarioFactory.auth = auth;
                usuarioFactory.authDate = dateAuth;
            });

            new Fingerprint2().get(function (result) {
                $scope.fingerPrint = result;
            }
            );
        });


        usuarioCtrl($scope, usuarioService, usuarioFactory, cobroFactory, $window, $webSql, $sce, $localStorage);
    }]);



