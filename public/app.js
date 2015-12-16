var app = angular.module('Hookly-App', []);

app.controller('MainCtrl', function($scope, $rootScope){
  
  $scope.list = [];
  $scope.user = {};
  $scope.user.wins = 0;
  $scope.user.loses = 0;
  $scope.user.id = shortid.generate();
  $rootScope.id = $scope.user.id;
  $scope.hangman = ['H', 'A', 'N', 'G', 'M', 'A', 'N'];
  $scope.count = -1;
  $scope.man = [];

  // INITIATE SOCKET CONNECTION
  hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', $scope.user.id);
  
  // SAVE USER NAME AND NOTIFY
  $scope.loginUser = function(name){
    $rootScope.name = name;
    $scope.user.name = name;
    hookly.notify('joined', $scope.user);
    $scope.getList($scope.user.id);
  };

  // ADD USER TO LIST ARRAY
  hookly.on('joined', function(data){
    checkForUserInList(data);
  }); 

  $scope.getList = function(uid){
  	hookly.notify('getList', uid);
  };

  // RESPONSE TO GET LIST = SEND LIST
  hookly.on('getList', function(uid){
    if($scope.user.name){
      hookly.notify('sendList', uid, $scope.user);
    }   
  });

  // ADD PLAYERS TO ONLINE LIST
  hookly.on('sendList', function(data){
    checkForUserInList(data);
  });

  function checkForUserInList(data){
    if($scope.list.length > 0){
      var presence = false;
      for(var i in $scope.list){
        if($scope.list[i].id == data.id){
          presence = true;
        }
      }
      if(!presence){
        $scope.list.push(data);
        $scope.$apply(); 
      }  
    } else {
      $scope.list.push(data);
      $scope.$apply();
    }    
  }

  // $scope.$on('$locationChangeStart', function( event ) {
  //   var answer = confirm("Are you sure you want to leave this page?")
  //   if (!answer) {
  //     event.preventDefault();
  //   }
  // });

  // window.onbeforeunload = function (event) {
  //   var message = 'Sure you want to leave?';
  //   debugger
  //   if (typeof event == 'undefined') {
  //     event = window.event;
  //   }
  //   if (event) {
  //     var answer = confirm(message);
  //     if(answer == true){
  //       removeUserFromList();
  //     }
  //     event.returnValue = message;
  //   }
  //   return message;
  // }

  // function removeUserFromList(){
  //   debugger
  //   hookly.notify('userLeaving', $scope.user.id);
  // }

  // hookly.on('userLeaving', function(data){
  //   if($scope.list > 0){
  //     for(var i in $scope.list){
  //       if($scope.list[i].id == data.id){
  //         $scope.list.splice(i,1);
  //       }
  //     }
  //   }   
  // });

  // window.onbeforeunload = closingCode;
  // function closingCode(){
  //   alert("CLOSING");
  // }

  // REQUEST TO PLAY
  $scope.play = function(uid){
    var req = { 
      from: {id: $rootScope.id, 
        name: $scope.user.name
      },
      message: " is asking if you want to play HANGMAN"
    };
    //console.log("PLAY" + uid);
    hookly.notify('req', uid, req);
  };
  
  // RESPONSE TO PLAY
  hookly.on('req', function(data){
    //console.log(data);
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

  // UPDATE WORD
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

  $scope.submitLetter = function(letter){
    var str = $scope.word.string.split('');
    //console.log(str);
    var found = false;
    // var won = false;
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
      if($scope.count == 5){
        $scope.playerLosesByCount();
      } else {
        $scope.count += 1;
        hookly.notify('addPart', $scope.count);
        $scope.man.push($scope.hangman[$scope.count]);
      }  
    }
    $scope.checkWin($scope.wordArr);
  }

  $scope.submitWord = function(word){
    if(word == $scope.word.string){
      alert('"' + word + '"' + ' was correct. You WON!');
      $scope.playerWins();
      hookly.notify('playerWon', $scope.user.name);
    } else {
      alert('"' + word + '"' + ' was incorrect.');
      if($scope.count == 5){
        $scope.playerLosesByCount();
      } else {
        $scope.count += 1;
        hookly.notify('addPart', $scope.count);
        $scope.man.push($scope.hangman[$scope.count]);
      }
    }
  };

  $scope.checkWin = function(arr){
    var won = true;
    for(var i in arr){
      if(arr[i] == '_'){
        return false;
      }
    }
    if(won == true){
      hookly.notify('playerWon', $scope.user.name);
      $scope.user.wins += 1;
      $scope.role = '';
      //alert('WON');
    }
  }

  $scope.playerWins = function(){
    $scope.user.wins += 1;
    $scope.role = '';
  };

  $scope.playerLoses = function(){
    $scope.user.loses += 1;
    $scope.role = '';
  };

  $scope.playerLosesByCount = function(){
    alert("YOU LOST, MAN IS BUILT");
    $scope.playerLoses();
    $scope.count += 1;  
    $scope.man.push($scope.hangman[$scope.count]);       
    hookly.notify('playerLost', $scope.count);
  };

  hookly.on('letterFound', function(data){
    //console.log(data);
    $scope.wordArr[data.index] = data.letter;
    $scope.$apply();   
  });

  hookly.on('addPart', function(data){
    $scope.man.push($scope.hangman[data]);
    $scope.$apply();
  });

  hookly.on('playerLost', function(data){
    $scope.man.push($scope.hangman[data]);
    $scope.playerWins();
    $scope.$apply();
    alert($scope.user.name + ", you WON!"); 
  });

  hookly.on('playerWon', function(data){
    $scope.user.loses += 1;
    $scope.role = '';
    $scope.$apply();
    alert(data + ' wins!' + " You lost!");
  });
});