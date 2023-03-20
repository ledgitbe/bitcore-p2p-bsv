'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('@chaingraph/bitcore-lib-cash');
var utils = require('../utils');
var $ = bitcore.util.preconditions;
var _ = bitcore.deps._;
var BufferUtil = bitcore.util.buffer;
var BufferReader = bitcore.encoding.BufferReader;
var BufferWriter = bitcore.encoding.BufferWriter;
var BN = bitcore.crypto.BN;

 
/**
 * A message to respond to an Auth Challenge message
 * @param {Object=} arg - an object of protocol configurations
 * @param {Integer=} arg.maxRecvPayloadLength - max protocol payload length, should not be less than 1 * 1024 * 1024
 * @param {Object=} options
 * @extends Message
 * @constructor
 */
function AuthResponseMessage(arg, options) {
  Message.call(this, options);
  this.command = 'authresp';
  this.public_key = arg && arg.public_key ? arg.public_key : utils.getNonce()
  this.public_key_length = this.public_key.length || 0
  this.client_nonce = arg && arg.client_nonce ? arg.client_nonce : new BN(1, 8);
  this.signature = arg && arg.signature ? arg.signature : utils.getNonce()
  this.signature_length = this.signature.length || 0
}
inherits(AuthResponseMessage, Message);

AuthResponseMessage.prototype.setPayload = function(payload) {
  var parser = new BufferReader(payload);
  $.checkArgument(!parser.finished(), 'No data received in payload');
  
  this.public_key_length = parser.readUInt32LE();
  this.public_key = parser.read(this.public_key_length());
  this.client_nonce = parser.readUint64LE();
  this.signature_lenth = parser.readUInt32LE();
  this.signature = parser.read(this.signature_length)

   utils.checkFinished(parser);
};

AuthResponseMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  
  bw.writeUInt32LE(this.public_key_length);
  bw.write(this.public_key);
  bw.writeUInt64LEBN(this.client_nonce);
  bw.writeUInt32LE(this.signature_length);
  bw.write(this.signature);

  return bw.concat();
};

module.exports = AuthResponseMessage;
