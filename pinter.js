var thumbstackURL = 'http://umitdincel.com/thumbstack.png';
var selectedThumbstackURL = 'http://umitdincel.com/thumbstack-selected.png';

var setCredentials = function(messages) {
  senderID = getSenderID('left', messages);
  me = getOwnerFbID('right', messages);

  return {'me': me, 'sender': senderID};
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

var $$$ = function(selector, callback) {
  if ($(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      $$$(selector, callback);
    }, 100);
  }
};

var reverseDirection = function(direction) {
  if(direction == 'left') {
    return 'right'
  } else if(direction ==  'right') {
    return 'left'
  }
}

var getPinnedMessages = function(conversationKey) {
  var conversationPinnedMessages = localStorage.getItem(conversationKey);
  if(!conversationPinnedMessages)
    return []
  return JSON.parse(conversationPinnedMessages);
}

var toggleThumbstack = function(thumbstack) {
  var thumbstackIcon =  $(thumbstack).find('img')[0];
  if($(thumbstack).hasClass('pinned')) {
    $(thumbstackIcon).attr('src', thumbstackURL);
    $(thumbstackIcon).css('opacity', '0.3');
    $(thumbstack).removeClass('pinned').addClass('non-pinned');
  } else if ($(thumbstack).hasClass('non-pinned')) {
    $(thumbstackIcon).attr('src', selectedThumbstackURL);
    $(thumbstackIcon).css('opacity', '1');
    $(thumbstack).removeClass('non-pinned').addClass('pinned');
  }
}

var scanMessages = function() {
  $$$('div[message]', function() {
    var messageRows = $('div[message].clearfix');
    var credentials = setCredentials(messageRows);
    var senderID = credentials.sender;
    var me = credentials.me;
    var conversationKey = me + '_' + senderID;
    var pinnedMessages = getPinnedMessages(conversationKey);

    $('.showPinnedMeesages').remove();
    $('.pinnedMessagesModal').remove();
    $($('div[role="presentation"]')[0]).prepend('<div class="showPinnedMeesages" style="position: absolute;top: 2px;left: 50%;width: 170px;margin-left: -85px;background-color: #f1f0f0;color: black;border-radius: 5px;cursor: pointer;text-align: center;height: 30px;line-height: 30px;z-index: 99;font-size: 12px;">Show pin messages</div>');

    $($('.showPinnedMeesages')[0]).click(function(){
      var pinnedMessages = getPinnedMessages(conversationKey);
      var body = $('<div></div>');
      for(var i = 0; pinnedMessages.length > 0; i++) {
        if(pinnedMessages[i] === undefined)
          break
        var pinnedMessage = JSON.parse(pinnedMessages[i]);
        body.append('<div style="margin: 10px 0;border: 1px solid #dac6c6;padding: 5px;">Message: '+ pinnedMessage.message +'<hr/>Date: '+ Date(pinnedMessage.date) +'</div>');
      }
      if(pinnedMessages.length == 0) {
        body.append('<div>You dont have any pinned messages for this conversation.</div>')
      }
      var bodyWrapper = $('<div class="pinnedMessagesModal" style="overflow:scroll;height:400px;position:absolute;top:60px;left:50%;z-index:99;background-color:#f1f0f0;text-align:center;width:80%;margin-left:-40%;padding:30px;"><a class="closePinnedMessagesModal" style="position:absolute;top:10px;right:10px;">close</a></div>').append(body);
      $($('div[role="presentation"]')[0]).prepend(bodyWrapper);
      $($('.closePinnedMessagesModal')[0]).click(function(){
        $('.pinnedMessagesModal').remove();
      });
    });

    $.each(messageRows, function(index, messageRow){
      var messageBox = $(messageRow).find('div[body]')[0];
      var direction = $(messageBox).attr('data-tooltip-position');
      var tUrl = thumbstackURL;
      var tOpacity = '0.3';
      var tCLass = 'non-pinned';

      for(var i = 0; pinnedMessages.length > i; i++) {
        var pinnedMessage = JSON.parse(pinnedMessages[i]);
        var currentMessage = $(messageBox).find('span').text();

        if(pinnedMessage['message'] == currentMessage) {
          tUrl = selectedThumbstackURL;
          tOpacity = '1';
          tCLass = 'pinned';
          break;
        }
      }

      $(messageBox).append('<div class="thumbstackIcon '+ tCLass +'" style="visibility:hidden;z-index:9;position:absolute;top:50%;margin-top:-10px;cursor:pointer;'+ reverseDirection(direction) +':-85px"><img style="opacity:'+ tOpacity +'" height="20" weight="20" alt="Pin the message" src="'+ tUrl +'"></div>');
      var thumbstack = $(messageBox).find('.thumbstackIcon')[0];

      $(thumbstack).on('click', function(){
        var message = $(messageBox).find('span').text();
        if($(thumbstack).hasClass('non-pinned')) {
          var now = Date.now();

          var pinnedMessages = getPinnedMessages(conversationKey);
          var data = JSON.stringify({
            'date': now,
            'message': message
          });

          pinnedMessages.push(data);
          localStorage.setItem(conversationKey, JSON.stringify(pinnedMessages));
        } else if ($(thumbstack).hasClass('pinned')) {
          var pinnedMessages = getPinnedMessages(conversationKey);
          for(var i = 0; pinnedMessages.length > 0; i++) {
            var pinnedMessage = JSON.parse(pinnedMessages[i]);
            if(pinnedMessage.message == message) {
              pinnedMessages.splice(i,1);
              localStorage.setItem(conversationKey, JSON.stringify(pinnedMessages));
              break;
            }
          }
        }
        toggleThumbstack(thumbstack);
      });

      $(messageRow).on('mouseenter', function(){
        $(thumbstack).css('visibility', 'visible');
      });

      $(messageRow).on('mouseleave', function(){
        $(thumbstack).css('visibility', 'hidden');
      });
    });
  });
}

$$$('div[role="gridcell"]', function() {
  $('div[role="gridcell"][id^="row_header_id_user"]').on('click', function() {
    setTimeout(scanMessages, 2000);
  });
});

scanMessages();