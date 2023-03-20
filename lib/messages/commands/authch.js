'use strict';

var Message = require('../message');
var inherits = require('util').inherits;
var bitcore = require('@chaingraph/bitcore-lib-cash');
var utils = require('../utils');
var $ = bitcore.util.preconditions;
var _ = bitcore.deps._;
var BufferUtil = bitcore.util.buffer;
var BufferReader = bitcore.encoding.BufferReader;
 
/**
 * A message to pose an Auth Challenge
 * @param {Object=} arg - an object of protocol configurations
 * @param {Integer=} arg.maxRecvPayloadLength - max protocol payload length, should not be less than 1 * 1024 * 1024
 * @param {Object=} options
 * @extends Message
 * @constructor
 */
function AuthChallengeMessage(arg, options) {
  Message.call(this, options);
  this.command = 'authch';
  this.version = arg && arg.version ? arg.version : 1;
  this.message = arg && arg.message ? arg.message : BufferUtil.EMPTY_BUFFER;
}
inherits(AuthChallengeMessage, Message);

AuthChallengeMessage.prototype.setPayload = function(payload) {
  var parser = new BufferReader(payload);
  $.checkArgument(!parser.finished(), 'No data received in payload');
  
  this.version = parser.readInt32LE();
  this.message_length = parser.readUInt32LE();
  this.message = parser.read(this.message_length)

   utils.checkFinished(parser);
};

AuthChallengeMessage.prototype.getPayload = function() {
  var bw = new BufferWriter();
  
  bw.writeInt32LE(this.version);
  bw.writeUInt32LE(this.message_length);
  bw.write(this.message);

  return bw.concat();
};

module.exports = AuthChallengeMessage;
