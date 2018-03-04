var senderID, me;

var setCredentials = function(messages) {
  senderID = getSenderID('left', messages);
  me = getOwnerFbID('right', messages);
}

var getSenderID = function(direction, messages){
  var anyMessageBox = messages.find('div[data-tooltip-position="'+ direction +'"]')[0];
  var threadid = $(anyMessageBox).attr('threadid');

  return threadid.substr(5,);
}

var parseOwnerID = function(participants) {
  participants_arr = participants.split('fbid:');
  last_ind = participants_arr[2].indexOf('":');

  return participants_arr[2].substr(0, last_ind);
}

var getOwnerFbID = function(direction, messages){
  var anyMessageBox = messages.find('div[data-tooltip-position="'+ direction +'"]')[0];
  var participants = $(anyMessageBox).attr('participants');

  return parseOwnerID(participants);
}

var waitForEl = function(selector, callback) {
  if ($(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

var reverseDirection = function(direction) {
  if(direction == 'left') {
    return 'right'
  } else if(direction == 'right') {
    return 'left'
  }
  console.log('Undefined direction: ' + direction);
}

waitForEl('div[message]', function() {
  var messageRows = $('div[message].clearfix');
  setCredentials(messageRows);

  $.each(messageRows, function(index, messageRow){
    var messageBox = $(messageRow).find('div[body]')[0];
    var direction = $(messageBox).attr('data-tooltip-position');

    $(messageBox).append('<div class="thumbstackIcon" style="visibility:hidden;z-index:9;position:absolute;top:5px;cursor:pointer;'+ reverseDirection(direction) +':-85px"><img style="opacity:0.3" height="20" weight="20" alt="Pin the message" src="https://cdn2.iconfinder.com/data/icons/bazza-social-networks-part-2/60/11_-_Pushpin-512.png"></div>');
    var thumbstack = $(messageBox).find('.thumbstackIcon')[0];

    $(thumbstack).on('click', function(){
      console.log($(messageBox).find('span').text(), senderID, me);
    });

    $(messageRow).on('mouseenter', function(){
      $(thumbstack).css('visibility', 'visible');
    });

    $(messageRow).on('mouseleave', function(){
      $(thumbstack).css('visibility', 'hidden');
    });
  });
});