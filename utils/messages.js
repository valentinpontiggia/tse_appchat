const moment = require ('moment');

function formatMessage(avatar, username, text){
    return {
        avatar,
        username,
        text,
        time : moment().format('h:mm a')
    }
}

const formatPrivateMessage = (avatar, username, text, recipient) => {
    return {
      avatar,
      username,
      text,
      recipient,
      time: moment().format('h:mm a'),
    };
  };
  

module.exports = {formatMessage, formatPrivateMessage};