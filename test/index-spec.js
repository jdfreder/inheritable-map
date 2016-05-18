import { InheritableMap } from '../src/index';
import Immutable from 'immutable';
import { expect } from 'chai';

class Table extends InheritableMap {
  toString() {
    return this.__toString('Table {', '}');
  }
}

describe('InheritableMap', function() {
  it('can be constructed', () => {
    const map = new InheritableMap();
    expect(map).to.be.instanceof(InheritableMap);
  });
  it('can be inherited', () => {
    const table = new Table();
    expect(String(table)).to.equal(`Table {}`);
    expect(table).to.be.instanceof(Table);
  });
  it('casts results', () => {
    const table = (new Table()).set('b', 1);
    expect(String(table)).to.equal(`Table { \"b\": 1 }`);
  });
  it('handles casting correct with nested values', () => {
    const table = (new Table())
      .set('b', 1)
      .setIn(['a', 'c', 4], 'test');
    expect(String(table)).to.equal(`Table { \"b\": 1, \"a\": Map { \"c\": Map { 4: \"test\" } } }`);
    expect(table).to.be.instanceof(Table);
    expect(table.get('a')).to.be.instanceof(Immutable.Map, 'get is not hooked');
  });
});
