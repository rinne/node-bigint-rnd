'use strict';

var _rbi;
var _bb;

if ((typeof (globalThis) === 'object') && globalThis && globalThis.crypto && globalThis.crypto.getRandomValues) {
	_rbi = function(bits) {
		if (bits < 1) {
			return 0n;
		}
		let bytes = bits >> 3;
		let rest = bits & 7;
		let mask;
		if (rest) {
			mask = 255 >> (8 - rest)
			bytes++;
		} else {
			mask = 255;
		}
		let b = globalThis.crypto.getRandomValues(new Uint8Array(bytes));
		b[0] &= mask;
		return BigInt('0x' + b.reduce(function(a, x) { return a + x.toString(16).padStart(2, '0'); }, ''));
	}
} else {
	let { randomBytes } = require('crypto');
	_rbi = function(bits) {
		if (bits < 1) {
			return 0n;
		}
		let bytes = bits >> 3;
		let rest = bits & 7;
		let mask;
		if (rest) {
			mask = 255 >> (8 - rest)
			bytes++;
		} else {
			mask = 255;
		}
		let b = randomBytes(bytes);
		b[0] &= mask;
		return BigInt('0x' + b.toString('hex'));
	}
}

const _bigIntBitsCalc = 0;

switch (_bigIntBitsCalc) {
  case 1:
	_bb = function(n) {
		let b = 0;
		while (n > 0n) {
			if (n >= 0x10000000000000000000000000000000000000000000000000000000000000000n) {
				n >>= 256n;
				b += 256;
			} else if (n >= 0x100000000000000000000000000000000n) {
				n >>= 128n;
				b += 128;
			} else if (n >= 0x10000000000000000n) {
				n >>= 64n;
				b += 64;
			} else if (n >= 0x100000000n) {
				n >>= 32n;
				b += 32;
			} else if (n >= 0x10000n) {
				n >>= 16n;
				b += 16;
			} else if (n >= 0x100n) {
				n >>= 8n;
				b += 8;
			} else if (n >= 0x10n) {
				n >>= 4n;
				b += 4;
			} else {
				n >>= 1n;
				b++;
			}
		}
		return b;
	}
	break;
  case 2:
	_bb = function(n) {
		let b = 0;
		while (n > 0n) {
			n >>= 1n;
			b++;
		}
		return b;
	}
	break;
  default:
	_bb = function(n) {
		if (n < 1n) {
			return 0;
		}
		return n.toString(2).length;
	}
	break;
}

if (1) {
} else {
}

function _bigintify(n) {
	switch (typeof(n)) {
	case 'bigint':
		break;
	case 'number':
		if (! Number.isSafeInteger(n)) {
			throw new RangeError('Value is not an integer');
		}
		n = BigInt(n);
		break;
	case 'string':
		try {
			n = BigInt(n);
		} catch(e) {
			throw new RangeError('Unable to convert string to BigInt');
		}
		break;
	default:
		throw new TypeError('Invalid value type');
	}
	return n;
}

function bigintRnd(n) {
	n = _bigintify(n);
	if (n < 1n) {
		throw new RangeError('Limit must be a positive value');
	}
	n--;
	let r, bits = _bb(n);
	do {
		r = _rbi(bits);
	} while(r > n);
	return r;
}

module.exports = bigintRnd;
