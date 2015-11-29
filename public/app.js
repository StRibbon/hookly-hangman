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
      //alert(data + " joined");     
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
    var req = { 
      from: {id: $rootScope.id, 
        name: $scope.user.name
      },
      message: "is asking if you want to play Hangman"
    };
    console.log("PLAY" + uid);
    hookly.notify('req', uid, req);
  };

  hookly.on('req', function(data){
    console.log(data);
    var res = prompt(data.from.name + data.message + ' Answer: yes or no!');
    if(res == 'yes'){
      hookly.notify('accepted', data.from.id, "HANGMAN" )
      alert('Challenge accepted!');
    } else {
      alert('Challenge denied!');
    }
  });

  hookly.on('accepted', function(data){
    alert(data);
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

