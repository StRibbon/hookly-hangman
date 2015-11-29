var app = angular.module('Hookly-App', ['ngCookies']);

app.controller('MainCtrl', function($scope, $cookieStore, $rootScope){
  
  $scope.list = [];
  $scope.user = {};
  $scope.user.id = shortid.generate();
  $rootScope.id = $scope.user.id;
  console.log($rootScope.id);
  hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', $scope.user.id);
  
  // SAVE USER NAME AND NOTIFY
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
  // ADD PLAYER TO LIST AND UPDATE UI
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
  // RESPONSE TO GET LIST = SEND LIST
  hookly.on('getList', function(uid){
  	hookly.notify('sendList', uid, $scope.list);
  });
  // ADD PLAYERS TO ONLINE LIST
  hookly.on('sendList', function(data){
    $scope.list = data;
    //debugger;
    $scope.$apply();    
  });
  // REQUEST TO PLAY
  $scope.play = function(uid){
    var req = { 
      from: {id: $rootScope.id, 
        name: $scope.user.name
      },
      message: " is asking if you want to play HANGMAN"
    };
    console.log("PLAY" + uid);
    hookly.notify('req', uid, req);
  };
  // RESPONSE TO PLAY
  hookly.on('req', function(data){
    console.log(data);
    var res = prompt(data.from.name.toUpperCase() + data.message + ' Answer: YES or NO!');
    if(res.toLowerCase() == 'yes'){
      hookly.notify('accepted', data.from.id, "HANGMAN" )
      alert('Challenge accepted!');
    } else {
      alert('Challenge denied!');
    }
  });
  // BEGIN GAME PLAY
  hookly.on('accepted', function(data){
    var word = prompt('Choose a word');
    var len = word.length;
    $scope.word = {length: len, string: word};
    $scope.$apply();
    hookly.notify('word', word);
  });

  hookly.on('word', function(data){
    var len = data.length;
    $scope.word = {length: len, string: data};
    $scope.$apply();
  });

  $scope.hangman = ['O', '|', '/', '\\', '-','-'];

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

