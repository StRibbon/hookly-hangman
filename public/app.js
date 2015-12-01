var app = angular.module('Hookly-App', ['ngCookies']);

app.controller('MainCtrl', function($scope, $cookieStore, $rootScope){
  
  $scope.list = [];
  $scope.user = {};
  $scope.user.wins = 0;
  $scope.user.loses = 0;
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
    if($scope.list.length == 0){
      var userToAdd = data.from;
      $scope.addUser(userToAdd);
    }
    var res = prompt(data.from.name.toUpperCase() + data.message + '\n Answer: YES or NO!');
    if(res.toLowerCase() == 'yes'){
      hookly.notify('accepted', data.from.id, "HANGMAN" )
      //alert('Challenge accepted!');
    } else {
      alert('Challenge denied!');
    }
  });
  // BEGIN GAME PLAY
  hookly.on('accepted', function(data){
    $scope.man = [];
    var word = prompt('CHOOSE A WORD:');
    var len = word.length;
    $scope.word = {length: len, string: word.toLowerCase()};
    $scope.role = 'chooser';
    $scope.wordArr = [];
    for(var i=0; i < len; i++){
      $scope.wordArr.push('_');
    };
    $scope.$apply();
    hookly.notify('word', word);
  });

  hookly.on('word', function(data){
    $scope.man = [];
    $scope.role = 'guesser';
    var len = data.length;
    $scope.wordArr = [];
    for(var i=0; i < len; i++){
      $scope.wordArr.push('_');
    };
    $scope.word = {length: len, string: data};
    $scope.$apply();
  });

  $scope.hangman = [' O', '- ', '-', ' |', '/', '\\'];
  $scope.count = -1;
  $scope.man = [];

  $scope.submitLetter = function(letter){
    var str = $scope.word.string.split('');
    console.log(str);
    var found = false;
    for(var i in str){
      if(str[i] == letter.toLowerCase()){
        //alert(letter + " is correct!");
        letterToSend = {};
        letterToSend.index = i;
        letterToSend.letter = letter;
        hookly.notify('letterFound', letterToSend);
        $scope.wordArr[i] = letter;
        var found = true;
        //$scope.$apply();
      }
    }
    if(found == false){
      if($scope.count == 4){
        alert("YOU LOST, MAN IS BUILT");
        $scope.user.loses += 1;
        $scope.count += 1;  
        $scope.man.push($scope.hangman[$scope.count]);
        hookly.notify('playerLost', $scope.count);
      } else {
        $scope.count += 1;
        hookly.notify('addPart', $scope.count);
        $scope.man.push($scope.hangman[$scope.count]);
      }  
    }
  }

  hookly.on('letterFound', function(data){
    console.log(data);
    $scope.wordArr[data.index] = data.letter;
    $scope.$apply();   
  });

  hookly.on('addPart', function(data){
    $scope.man.push($scope.hangman[data]);
    $scope.$apply();
  });

  hookly.on('playerLost', function(data){
    debugger
    $scope.man.push($scope.hangman[data]);
    $scope.user.wins += 1;
    $scope.$apply();
    alert("You WON!"); 
  })
});

