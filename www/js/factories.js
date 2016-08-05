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
//        url: "http://204.197.242.154:8080/cobroYaWs/"
//        url: "http://localhost:8080/cobroYaWs/"
//url: "http://localhost/cobroYa/ws/"
        k: "SXGWLZPDOKFIVUHJYTQBNMACERjhtybqmncarexswgzldpkoifuv",
        i: "%3FgnJ.BsOHgpOUc",
        a: "%3FJng.TLVHpQNGDBNS",
        l: "%2FdA%2FjEHTXwt%2FlS.VHt.PsOjTNmj.AAA%2F%2F%3AdJBpD"
    };
});

