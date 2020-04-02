const Scrible = require('../models/scrible.js');
module.exports = {
  name: 'remove',
  usage: '?remove [, words; separated by spaces and words with spaces: "An example"]',
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
        temp += '"'+args[i] + '", ';
      } else if (i == args.length-1 && args.length != 1) {
        temp += '"'+args[i] + '" and '
      } else {
        temp += '"'+args[i]+'"';
      }
    }
    message.channel.send('Removed: ' + titleCase(temp)).then((msg) => {msg.delete({ timeout:10000 })});;
    message.delete();
  }
}

function titleCase(str) {
   var splitStr = str.toLowerCase().split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       if (splitStr[i].startsWith('"')) {
         splitStr[i] = '"' + splitStr[i].charAt(1).toUpperCase() + splitStr[i].substring(2);
       } else {
         splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
       }
   }
   // Directly return the joined string
   return splitStr.join(' ');
}
