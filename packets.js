var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var packetSchema = new Schema({
  packet   : { type: String}
  , ip : {type: String}
  , port			: { type: String }
});

var packets = mongoose.model('packets', packetSchema);

module.exports = {
  packets: packets
};