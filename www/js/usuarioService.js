/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('usuarioService', ['$http', '$q', 'wsFactory', '$window', function ($http, $q, wsFactory, $window) {

        var db = null;

        this.initPointMP = function (titleMp, cantMp, precMp, authToken) {
            //defered = diferido (asincrono)
            var defered = $q.defer();
            var promise = defered.promise;

            var parametros = 'title=' + titleMp + '&cant=' + cantMp + '&money=' + precMp + '&auth=' + authToken;
            $http.get(wsFactory.l + 'InitPoint.php?' + parametros)
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
            $http.get(wsFactory.l + 'AuthCustomer.php?' + parametros)
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



        this.abrirBD = function () {
            try {
                db = $window.openDatabase("Database", "1.0", "cobroYadb", 200000);
            } catch (e) {
                console.log('La aplicacion no soporta html5 database.');
            }

//            db.transaction(executeQuery, errorCB, successCB);
        };

        this.crearTabla = function () {
            db.transaction(function (tx) {
                tx.executeSql('DROP TABLE IF EXISTS authmeli');
                tx.executeSql('CREATE TABLE IF NOT EXISTS authmeli (id integer primary key autoincrement, acces text, dateAuth long)');
            });
            //tx.executeSql('DROP TABLE IF EXISTS auth');
//            tx.executeSql('CREATE TABLE IF NOT EXISTS authmeli (id unique, auth, date)');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (1, "あいうえお")');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (2, "かきくけこ")');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (3, "さしすせそ")');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (4, "たちつてと")');        
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (5, "なにぬねの")');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (6, "はひふへほ")');
//        tx.executeSql('INSERT INTO TestTable (id, data) VALUES (7, "まみむめも")');

        };

        this.obtenerAuth = function () {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id, auth, dateAuth FROM authmeli', [], function (tx, respuesta) {
                    if (respuesta.rows.length !== 0) {
                        var id = respuesta.rows.item(0).id;
                        var auth = JSON.parse(respuesta.rows.item(0).auth);
                        var dateAuth = respuesta.rows.item(0).dateAuth;
                    } else {
                        
                    }
                }, function () {

                });
            });
        };

        this.insertarAuth = function (auth, dateAuth) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT id, auth, dateAuth FROM authmeli', [], function (tx, respuesta) {
                    if (respuesta.rows.length === 0) {
                        tx.executeSql("INSERT INTO authmeli(auth, dateAuth) VALUES(?,?)", [JSON.stringify(auth), dateAuth], function (tx, respuesta) {
                            console.log('La autorizacion ha sido insertada correctamente');
                        }, function (tx, respuesta) {
                            console.log('La autorizacion no ha podido ser insertado');
                        });
                    } else {
                        tx.executeSql("DELETE FROM authmeli", [], function (tx, respuesta) {
                            console.log('La autorizacion ha sido eliminada correctamente');
                        }, function (tx, respuesta) {
                            console.log('La autorizacion no ha podido ser eliminada');
                        });
                    }
                }, function () {

                });
            });
        };

        this.borrarAuth = function () {
            db.transaction(function (tx) {
                tx.executeSql("DELETE FROM authmeli", [], function (tx, respuesta) {
                    console.log('La autorizacion ha sido eliminada correctamente');
                }, function (tx, respuesta) {
                    console.log('La autorizacion no ha podido ser eliminada');
                });
            });
        };
//        this.queryDB = function (tx) {
//            tx.executeSql('SELECT * FROM authmeli', [], querySuccess, errorCB);
//        };
//
//        this.querySuccess = function (tx, results) {
//            var len = results.rows.length;
//            $window.alert("There are " + len + " rows of records in the database.");
//            for (var i = 0; i < len; i++) {
//                console.log("row = " + i + " ID = " + results.rows.item(i).id + " auth = " + results.rows.item(i).auth + "<br/>");
//            }
//        };
//
//        //Callback function when the transaction is failed.
//        this.errorCB = function (err) {
//            console.log("Error occured while executing SQL: " + err.code);
//        };
//
//        // Callback function when the transaction is success.
//        this.successCB = function () {
//            var db = $window.openDatabase("Database", "1.0", "cobroYadb", 200000);
//            db.transaction(queryDB, errorCB);
//        }

    }]);

