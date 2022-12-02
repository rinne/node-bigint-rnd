'use strict';

const assert = require('assert');
const bigintRnd = require('../bigint-rnd');

const N = 1000;

for (let i = 0; i < N; i++) {
	assert.strictEqual(bigintRnd(1), 0n);
	assert.strictEqual(bigintRnd('1'), 0n);
	assert.strictEqual(bigintRnd('0x1'), 0n);
	assert.strictEqual(bigintRnd('0b1'), 0n);
	assert.strictEqual(bigintRnd(1n), 0n);
}

for (let i = 0; i > -N; i--) {
	let e;
	try {
		bigintRnd(i);
	} catch (err) {
		e = err;
	}
	if (! e) {
		throw new Error('Unexpectedly no error thrown');
	}
}

for (let i = 0; i < N; i++) {
	let x;
	x = bigintRnd('0x10000');
	assert((typeof(x) === 'bigint') && (x >= 0n) && (x < 65536n));
	x = bigintRnd(0x1000000);
	assert((typeof(x) === 'bigint') && (x >= 0n) && (x < 16777216n));
	x = Number(bigintRnd(BigInt(Number.MAX_SAFE_INTEGER) -
						 BigInt(Number.MIN_SAFE_INTEGER) +
						 1n) +
			   BigInt(Number.MIN_SAFE_INTEGER));
	assert(Number.isSafeInteger(x));
}

{
	let x = Array(17).fill(0);
	let n = N * x.length;
	for (let i = 0; i < n; i++) {
		x[bigintRnd(x.length)]++;
	}
	x = x.map(function(v) { return v * x.length / n; });
	let min = Math.min.apply(this, x);
	let max = Math.max.apply(this, x);
	// It should be very unlikely for the following to fail if N > 500.
	assert((min > 0.7) && (max < 1.3));
}
