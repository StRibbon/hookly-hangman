var userId = shortid.generate();
console.log(userId);

window.title = userId;

hookly.start('T2rTVLncKjd1G0wuRR8ks22FMeRyzu-UyKfOqmdldXxFIzhV', userId);

hookly.notify('message', "Hello Twirl");

//hookly.notify('move', {x, y});

hookly.on('message', function(data){
  console.log(data);
});