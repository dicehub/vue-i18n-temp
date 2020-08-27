import { getValueByPath } from '../getValueByPath';

describe('utils/getValueByPath', () => {
  it('should find value in a flat map', () => {
    const map = { key: 'value' };

    expect(getValueByPath(map, 'key')).toBe('value');
  });

  it('should find value in a so.very.deep map', () => {
    const map = {
      so: {
        very: {
          deep: {
            key: 'value',
          },
        },
      },
    };

    expect(getValueByPath(map, 'so.very.deep.key')).toBe('value');
  });

  it('should return null if no value has been found on the root value', () => {
    const map = {
      foo: {
        bar: 'baz',
      },
    };

    expect(getValueByPath(map, 'bar')).toBeNull();
  });

  it('should return null if no value has been found on the deepest value', () => {
    const map = {
      foo: {
        key1: 'val1',
        key2: 'val2',
      },
    };

    expect(getValueByPath(map, 'foo.key3')).toBeNull();
  });

  it('should not fail if provided path is null', () => {
    const map = {
      key: 'value',
    };

    expect(getValueByPath(map, null)).toBeNull();
  });
});
