var bitcore = require('@chaingraph/bitcore-lib-cash');
bitcore.P2P = require('./lib');
bitcore.P2P.internalBitcore = bitcore;

module.exports = bitcore.P2P;
