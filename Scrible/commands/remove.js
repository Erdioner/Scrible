const Scrible = require('../models/scrible.js');
module.exports = {
  name: 'remove',
  usage: '?remove [, words; separated by spaces]',
  description: 'Remove word(-s) from the custom words list.',
  execute(message, args) {
    args = [...new Set(args)];
    Scrible.findOne({ tag: 'CustomWords' }, (err, scrible) => {
      if (err) return handleError(err);
      Scrible.updateOne({ tag: 'CustomWords' }, { data: [...new Set(scrible.data.filter((word) => {
        return args.includes(word) != true;
      }))]}, (err, res) => {
        if (err) return handleError(err);
      });
    });
    temp = '';
    for (var i = 0; i < args.length; i++) {
      if (i < args.length-2) {
        temp += args[i] + ', ';
      } else if (i == args.length-1) {
        temp += args[i] + ' and '
      } else {
        temp += args[i];
      }
    }
    message.channel.send('Removed: ' + temp).then((msg) => {msg.delete({ timeout:10000 })});;
    message.delete();
  }
}
