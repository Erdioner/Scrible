const Scrible = require('../models/scrible.js');
module.exports = {
  name: 'custom',
  usage: '?custom',
  description: 'Displays all words from custom list.',
  execute(message, args) {
    Scrible.findOne({ tag: 'CustomWords' }, (err, scrible) => {
      if (err) return handleError(err);
      temp = '';
      for (var i = 0; i < scrible.data.length; i++) {
        if (i < scrible.data.length-1) {
          temp += scrible.data[i] + ', ';
        } else {
          temp += scrible.data[i];
        }
      }
      if (temp != '') {
        message.channel.send('All custom words are: \n'+temp).then((msg) => {msg.delete({ timeout:60000 })});
      } else {
        message.channel.send('No custom words in list').then((msg) => {msg.delete({ timeout:5000 })});
      }
      message.delete();
    });
  }
}
