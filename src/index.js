import Immutable from 'immutable';
import isFunction from 'lodash.isfunction';

/**
 * Immutable.Map class that can be inherited from
 */
export class InheritableMap {

  /**
   * Public constructor
   */
  constructor() {
    // Create an instance of an Immutable map and copy the instance attributes
    // to this InheritableMap instance.
    const map = new Immutable.Map();
    Object.keys(map).forEach(key => {
      this[key] = map[key];
    });
  }
  /**
   * Cast to instance type
   * @param  {any} x object to cast
   * @return {any} object cast to this.__proto__
   */
  __cast(x) {
    Object.setPrototypeOf(x, Object.getPrototypeOf(this));
    return x;
  }
}

const MAP_PROTOTYPE = Object.getPrototypeOf(new Immutable.Map());

/**
 * Gets the names of all of the attributes of an Immutable.Map instance
 * @return {string[]}
 */
function getMapNames() {
  // Walk the prototypes until at the oldest parent
  let prototype = MAP_PROTOTYPE;
  let functions = new Immutable.Set();
  while (prototype) {
    functions = functions.union(Object.keys(prototype));
    prototype = Object.getPrototypeOf(prototype);
  }

  // Make sure the names are not the constructor
  return functions.filter(name => name !== 'constructor');
}

/**
 * Wrap function so that Map type outputs are cast to the InheritableMap
 * instance type
 * @param  {function} fn
 * @return {function}
 */
function proxyFunction(fn) {
  return function proxy(...args) {
    const makeCall = () => fn.apply(this, args);

    // Only perform casting if this exists and is unlocked
    if (this && !this.__castingLock) {
      try {
        this.__castingLock = true;
        const x = makeCall();

        // Make sure the __cast method exists.  Sometimes it wont exist.  This can
        // happen when one of the methods are invoked using another context.
        // Also only cast Map type results.
        if (this.__cast && Immutable.Map.isMap(x)) {
          return this.__cast(x);
        }
        return x;
      } finally {
        this.__castingLock = false;
      }
    } else {
      return makeCall();
    }
  };
}

// Manually convert the non-ES6 Immutable.Map to an ES6 class.
getMapNames().forEach(name => {
  if (isFunction(MAP_PROTOTYPE[name])) {
    // Don't hook output of get or getIn
    if (name === 'get' || name === 'getIn') {
      InheritableMap.prototype[name] = MAP_PROTOTYPE[name];
    } else {
      InheritableMap.prototype[name] = proxyFunction(MAP_PROTOTYPE[name]);
    }
  } else {
    InheritableMap.prototype[name] = MAP_PROTOTYPE[name];
  }
});
