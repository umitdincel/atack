var waitForEl = function(selector, callback) {
  if ($(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

waitForEl('div[message]', function() {
  	var messages = $('div[message]:not(.clearfix)');

  	$.each(messages, function(index, message){
  		$(message).on('click', function(){
  			console.log($(this).find('span').text());
  		});
  	});
});