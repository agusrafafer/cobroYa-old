/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Onsen.service('noticiaService', function($http, $q) {

    this.noticiasRss = function() {
        //defered = diferido (asincrono)
//        var defered = $q.defer();
//        var promise = defered.promise;
        return $http.get('http://www.minutouno.com/rss/principal.xml');
//                .success(function(data) {
//                    //$scope.blogs = data.blogs.blog;
//                    return data;
//                });

//        return promise;

//        $http.get('http://api.openweathermap.org/data/2.5/weather?id=3866169&appid=e318e5ace633f817095d5af39759517c')
//                .success(function(data) {
//                    defered.resolve(data);
//                })
//                .error(function(data, status) {
//                    defered.reject(data, status);
//                });
//
//        return promise;


//      var deferred = $q.defer();
//      //id cordoba provincia: 3866169
//      $http.get('http://api.openweathermap.org/data/2.5/weather?id=3866169&appid=e318e5ace633f817095d5af39759517c').then(
//          function(response) {
//          var statusCode = parseInt(response.data.cod);
//
//          if (statusCode === 200) {
//            deferred.resolve(response.data);
//          }
//          else {
//            deferred.reject(response.data.message);
//          }
//        },
//        function(error) {
//          deferred.reject(error); 
//        }
//      );
//      return deferred.promise;
    };



});


