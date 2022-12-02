BigInt Random
=============

A small library for generating cryptographically strong unbiasesd
pseudorandom integers (bigint) within a given range (0 <= x < limit).

The implementation relies on the output from crypto.randomBytes()
function in Node.JS. It is easy to modify the code for the alternative
random sources.


Algorithm
=========

The only simple and efficient way to generate unbiased set of random
values from random byte source within an arbitrary range is as
follows:

1. Calculate the bit length of and byte length of the maximum output
   value.
2. Generate byte-length amount of random bytes.
3. Mask the extra bits to zero from the most significant byte.
4. Construct a number from the buffer of random bytes.
5. If the constructed number is bigger than the maximum output value,
   go back to point 2.
6. Return the constructed number.

In the algorithm above, it is also important to generate the entire
set of random bytes again in case of the constructed output being too
big to fit into the expected range. E.g. generating only one or two
most significant bytes would immediately cause a bias.

While generating a random value much bigger than the maximum output
value and forcing it into the acceptable range by taking the modulus
(mod limit + 1) from the value, it still almost always causes mostly
insignificant but still existing bias. That is why for the
cryptographic purposes a truely unbiased algirithm should always be
used.


Reference
=========

```
'use strict';

const bigintRnd = require('bigint-rnd');

let x;

// Always returns 0n,
x = bigintRnd(1);

// Always returns 0n or 1n,
x = bigintRnd(2n);

// Throws a RangeError, because the limit must be a positive integer.
try {
  x = bigintRnd(0);
} catch (e) {
  console.log(e);
}

// Returns a bigint 0 <= x < 10^100
x = bigintRnd(10n ** 100n);

// Returns a bigint 0 <= x < 65536
x = bigintRnd('0x10000');

// Returns a safe integer in number type in range
// Number.MIN_SAFE_INTEGER <= x <= Number.MAX_SAFE_INTEGER
// i.e. within the full safe integer range of the  number type.
x = Number(bigintRnd(BigInt(Number.MAX_SAFE_INTEGER) -
                     BigInt(Number.MIN_SAFE_INTEGER) +
                     1n) +
           BigInt(Number.MIN_SAFE_INTEGER));
```


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

MIT License
