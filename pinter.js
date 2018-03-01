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
  var messageRows = $('div[message].clearfix');

  $.each(messageRows, function(index, messageRow){
    $(messageRow).on('click', function(){
      var messageBox = $(this).find('div[body]')[0];
      var messageText = $(messageBox).find('span').text();

      console.log(messageText, $(messageBox).position());
    });
  });
});