/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.factory('usuarioFactory', function() {
    return {
        usuario: "",
        tituloMenu: "Cobro Ya",
        clientIdMp: "",
        clientSecretMp: "",
        auth: {}
    };
});

Onsen.factory('cobroFactory', function() {
    return {
        initPoint: "",
        title: "",
        cant: 0.00,
        prec: 0.00
    };
});


Onsen.factory('wsFactory', function() {
    return {
//        url: "http://204.197.242.154:8080/cobroYaWs/"
//        url: "http://localhost:8080/cobroYaWs/"
//url: "http://localhost/cobroYa/ws/"
        la: "https://auth.mercadopago.com.ar/authorization?client_id=4098737792138788&response_type=code&platform_id=mp&redirect_uri=https://www.aguraing.com.ar/cobroYa/ws/AuthCustomer.php",
        l: "https://www.aguraing.com.ar/cobroYa/ws/"
    };
});

