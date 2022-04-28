const base64 = exports;

base64.encode = function (unencoded) {
  return new Buffer(unencoded || '').toString('base64');
};

base64.decode = function (encoded) {
  return new Buffer(encoded || '', 'base64').toString('utf8');
};

base64.urlEncode = (unencoded) => {
  var encoded = base64.encode(unencoded);
  return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};

base64.urlDecode = (encoded) => {
  encoded = encoded.replace('-', '+').replace('_', '/');
  while (encoded.length % 4) encoded += '=';
  return base64.decode(encoded);
};
