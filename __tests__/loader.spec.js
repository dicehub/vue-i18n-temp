const loader = require('../loader');

describe('@dicehub/vue-18n/loader', () => {
  it('should modinfy simple Vue component', () => {
    const source = `
export default {
  data() {
    return {
      foo: 'bar'
    }
  }
}
`;

    expect(loader(source)).toEqual(`
export default {
  $componentModule: __dirname,
  data() {
    return {
      foo: 'bar'
    }
  }
}
`);
  });

  it('should works fine with no spaces', () => {
    const source = `
export default{
  data() {
    return {
      foo: 'bar'
    }
  }
}
`;

    expect(loader(source)).toEqual(`
export default{
  $componentModule: __dirname,
  data() {
    return {
      foo: 'bar'
    }
  }
}
`);
  });

  it('should modify Vue component wrapped to defineComponent()', () => {
    const source = `
export default defineComponent({
  data() {
    return {
      foo: 'bar'
    }
  }
});
`;

    expect(loader(source)).toEqual(`
export default defineComponent({
  $componentModule: __dirname,
  data() {
    return {
      foo: 'bar'
    }
  }
});
`);
  });

  it('should modify Vue component wrapped to `defineComponent () (with spaces)`', () => {
    const source = `
export default defineComponent  ({
  data() {
    return {
      foo: 'bar'
    }
  }
});
`;

    expect(loader(source)).toEqual(`
export default defineComponent  ({
  $componentModule: __dirname,
  data() {
    return {
      foo: 'bar'
    }
  }
});
`);
  });
});
