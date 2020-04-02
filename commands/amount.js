const Scrible = require('../models/scrible.js');
module.exports = {
  name: 'amount',
  usage: '?amount',
  description: 'Number of words in custom list.',
  execute(message, args) {
    args = [...new Set(args)];
    Scrible.findOne({ tag: 'CustomWords' }, (err, scrible) => {
      if (err) return handleError(err);
      message.channel.send('Amount: ' + scrible.data.length).then((msg) => {msg.delete({ timeout:10000 })});;
    });
    if (message.deletable) {
      message.delete();
    }
  }
};

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
