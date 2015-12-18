# tiny-xml
[![build status](https://secure.travis-ci.org/avoidwork/tiny-xml.svg)](http://travis-ci.org/avoidwork/tiny-xml)

Tiny UUID version 4 for Client and Server

## Example
```javascript
const xml = require("tiny-xml"),
  serialized = xml.serialize("Hello World!", "node"),
  valid = xml.valid(serialized),
  obj = valid ? xml.parse(serialized) : {};

console.log(valid); // true
console.log(obj.getElementsByTagName("node")[0].textContent); // Hello World!
```

## API

#### parse (arg)
Parses the argument and returns a Document.

#### serialize (arg, key = "xml", wrap = true, top = true)
Serializes the argument as XML.

#### valid (arg)
Tests if the argument is valid XML.

## License
Copyright (c) 2015 Jason Mulligan
Licensed under the BSD-3 license
