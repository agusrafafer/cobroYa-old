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
        clientSecretMp: ""
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
//        url: "http://braulito-agura.rhcloud.com/braulito/webresources"
        url: "http://localhost:8084/PruebaMercadoPago/webresources"
    };
});

