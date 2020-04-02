const Scrible = require('../models/scrible.js');
module.exports = {
  name: 'add',
  usage: '?add [, words; separated by spaces and words with spaces: "An example"]',
  description: 'Add word(-s) to the custom words list.',
  execute(message, args) {
    args = [...new Set(args)];
    Scrible.findOne({ tag: 'CustomWords' }, (err, scrible) => {
      if (err) return handleError(err);
      Scrible.updateOne({ tag: 'CustomWords' }, { data: [...new Set(scrible.data.concat(args))] }, (err, res) => {
        if (err) return handleError(err);
      });
    });
    temp = '';
    for (var i = 0; i < args.length; i++) {
      if (i < args.length-2) {
        temp += '"'+args[i] + '", ';
      } else if (i == args.length-1 && args.length != 1) {
        temp += '"'+args[i] + '" and '
      } else {
        temp += '"'+args[i]+'"';
      }
    }
    message.channel.send('Added: ' + temp).then((msg) => {msg.delete({ timeout:10000 })});;
    if (message.deletable) {
      message.delete();
    }
  }
};
