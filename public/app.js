var app = angular.module('Hookly-App', ['ngCookies']);

app.controller('MainCtrl', function($scope, $cookieStore, $rootScope){
  
  $scope.list = [];
  $scope.user = {};
  $scope.user.id = shortid.generate();
  $rootScope.id = $scope.user.id;
  console.log($rootScope.id);
  hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', $scope.user.id);
  
  
  $scope.loginUser = function(name){
    //$cookieStore.put('name', name);
    $rootScope.name = name;
    $scope.user.name = name;
    hookly.notify('joined', $scope.user);
  };

  hookly.on('joined', function(data){
      console.log(data);
      $scope.addUser(data);
      $scope.getList($scope.user.id);
      alert(data + " joined");     
  }); 

  $scope.addUser = function(data) {
    setTimeout(function() {
      $scope.list.push(data);
      console.log('Added to list:' + data);
      $scope.$apply();
    }, 0);
  };

  $scope.getList = function(uid){
  	hookly.notify('getList', uid);
  };

  hookly.on('getList', function(uid){
  	hookly.notify('sendList', uid, $scope.list);
  });

  hookly.on('sendList', function(data){
    $scope.list = data;
    //debugger;
    $scope.$apply();    
  });

  $scope.play = function(uid){
    console.log("PLAY" + uid);
    hookly.notify('req', uid, "Want to play?");
    debugger
  };

  hookly.on('req', function(data){
    console.log(data);
  });

});

//var userId = shortid.generate();
//console.log(userId);

//window.title = userId;

//hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', userId);

//hookly.notify('message', "Hello Twirl");

//hookly.notify('move', {x, y});

// hookly.on('message', function(data){
//   console.log(data);
// });

// hookly.notify('message', 'NkbMp16Xx', 'Sup Mane');

