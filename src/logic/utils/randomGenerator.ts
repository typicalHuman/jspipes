export function generateRandomNumberMurmurHash3(
  salt: string,
  min: number,
  max: number
) {
  const hash = murmurHash3(salt);
  return (hash % (max - min)) + min;
}

export function murmurHash3(str: string) {
  var h1 = 0;
  var len = str.length;
  var k1 = 0;
  var i = 0;

  while (len >= 4) {
    k1 =
      (str.charCodeAt(i) & 0xff) |
      ((str.charCodeAt(i + 1) & 0xff) << 8) |
      ((str.charCodeAt(i + 2) & 0xff) << 16) |
      ((str.charCodeAt(i + 3) & 0xff) << 24);

    k1 = k1 * 0xcc9e2d51;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = k1 * 0x1b873593;

    h1 = h1 ^ k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = h1 * 5 + 0xe6546b64;

    i += 4;
    len -= 4;
  }

  k1 = 0;
  switch (len) {
    case 3:
      k1 ^= (str.charCodeAt(i + 2) & 0xff) << 16;
      break;
    case 2:
      k1 ^= (str.charCodeAt(i + 1) & 0xff) << 8;
      break;
    case 1:
      k1 ^= str.charCodeAt(i) & 0xff;
      break;
  }

  k1 = k1 * 0xcc9e2d51;
  k1 = (k1 << 15) | (k1 >>> 17);
  k1 = k1 * 0x1b873593;

  h1 = h1 ^ k1;
  h1 = h1 ^ str.length;
  h1 = h1 ^ (h1 >>> 16);
  h1 = h1 * 0x85ebca6b;
  h1 = h1 ^ (h1 >>> 13);
  h1 = h1 * 0xc2b2ae35;
  h1 = h1 ^ (h1 >>> 16);

  return h1 >>> 0; // Ensure it's a positive integer
}
