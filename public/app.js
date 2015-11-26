var app = angular.module('Hookly-App', ['ui.router', 'ngCookies']);

app.config([
  '$locationProvider',
  '$stateProvider',
  '$urlRouterProvider',
  function($locationProvider, $stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    // routes
    $stateProvider
      .state('signin', {
        url: '/signin',
        templateUrl: 'views/sign-in.html',
        controller: 'MainCtrl'
    });
  }
]);

app.controller('MainCtrl', function($scope, $cookieStore){
  $scope.userId = shortid.generate();
  $scope.loginUser = function(userName){
    $cookieStore.put('userName', userName);
  };
});


var userId = shortid.generate();
console.log(userId);

//window.title = userId;

hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', userId);

hookly.notify('message', "Hello Twirl");

//hookly.notify('move', {x, y});

hookly.on('message', function(data){
  console.log(data);
});

// hookly.notify('message', 'NkbMp16Xx', 'Sup Mane');