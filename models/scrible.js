const mongoose = require('mongoose');

const scribleSchema = new mongoose.Schema({
  data: {
    type: [],
    required: true
  },
  tag: {
    type: String,
    required: true
  }
});

let Scrible = module.exports = mongoose.model('Scrible', scribleSchema);
