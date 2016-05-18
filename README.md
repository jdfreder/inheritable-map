# InheritableMap
Inheritable version of the Immutable.Map data type

## Why?
`are(you(tired(of(counting(parenthesis)))))`?  This package allows you to
extend the Immutable.Map data type `so.you.can.use.dot(notation)`!

## Installation

```
npm install --save inheritable-map
```

## Usage

To inherit from Map in ES6 and add a toString override, do the following:

```js
import { InheritableMap } from 'inheritable-map';

class Table extends InheritableMap {
  toString() {
    return this.__toString('Table {', '}');
  }
}
```

To do the same thing in ES5:

```js
var InheritableMap = require('inheritable-map').InheritableMap;

function Table() {
  InheritableMap.prototype.apply(this, arguments);
}
Table.prototype = Object.create(InheritableMap);

Table.prototype.toString = function toString() {
  return this.__toString('Table {', '}');
}
```

Now you can construct an instance of your Map based class (ES5/ES6):

```js
var table = new Table();
```
