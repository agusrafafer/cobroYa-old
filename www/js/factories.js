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
        idAuth: -1,
        auth: {},
        authDate: -1
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
        k: "SXGWLZPDOKFIVUHJYTQBNMACERjhtybqmncarexswgzldpkoifuv", // es la clave del deco/enco js
        i: "%3FJDg.LIcDGpUcHgBOsO", // es initpointChile.php? 
        a: "%3FgDg.becDGTbVHBdkGDBNj", //es authcustomerChile.php?
        l: "%2FdA%2FjEHTXwt%2FlS.VHt.PsOjTNmj.AAA%2F%2F%3AdJBpD" // es la url del ws https://www.aguraing.com.ar/cobroya/ws/ 
    };
});

