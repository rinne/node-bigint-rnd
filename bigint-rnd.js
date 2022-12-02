'use strict';

const { randomBytes } = require('crypto');

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
	let r, h = n.toString(16);
	if (h.length % 2) {
		h = '0' + h;
	}
	let l = h.length / 2, p = 1;
	for (let m = parseInt('0x' + h.slice(0, 2)); p < m; p = (p << 1) | 1) {
		/*NOTHING*/
	}
	do {
		let b = randomBytes(l);
		b[0] &= p;
		r = BigInt('0x' + b.toString('hex'));
	} while(r > n);
	return r;
}

module.exports = bigintRnd;
