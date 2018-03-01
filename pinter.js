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
  var message_rows = $('div[message].clearfix');

  $.each(message_rows, function(index, message_row){
    $(message_row).on('click', function(){
      var message_box = $(this).find('div[body]')[0];
      var message_text = $(message_box).find('span').text();

      console.log(message_text, $(message_box).position());
    });
  });
});