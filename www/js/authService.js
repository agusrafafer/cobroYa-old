/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('authService', function($http, $q, $timeout, wsFactory) {
    var cont = 0;
    var timer;
    
    this.iniciarTimer = function() {
        timer = $timeout(wrapper(), 500000);
    };  
    
    this.mostrarTimer = function() {
      return cont;  
    };
    
    function wrapper() {
        $timeout.cancel(timer);
        contar();
        $timeout(wrapper, 500000);
    };
    
    function contar() {
        cont++;
//        ons.notification.alert({
//            title: 'Info',
//            messageHTML: '<strong style=\"color: #ff3333\">Contador: ' + cont + '</strong>'
//        });

        
        console.log(cont);
    };

});

