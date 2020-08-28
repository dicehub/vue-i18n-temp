const loader = require('../loader');

describe('@dicehub/vue-18n/loader', () => {
  it('should modify simple Vue component code', () => {
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

  it('should modify Vue component wrapped to `defineComponent ()` (with spaces)', () => {
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

  it('should modify Vue component wrapped to `defineComponent()` and processed by Webpack', () => {
    const source = `
exports.default =  composition_api_1.defineComponent({
  data() {
    return {
      foo: 'bar'
    }
  }
});
`;

    expect(loader(source)).toEqual(`
exports.default =  composition_api_1.defineComponent({
  $componentModule: __dirname,
  data() {
    return {
      foo: 'bar'
    }
  }
});
`);
  });

  it('should modify Vue component wrapped with Vue.extend util', () => {
    const source = `
import Vue from 'vue';
import Socials from '@shared/components/Socials.vue';

export default Vue.extend({
  components: {
    Socials,
  },
});
`;

    expect(loader(source)).toEqual(`
import Vue from 'vue';
import Socials from '@shared/components/Socials.vue';

export default Vue.extend({
  $componentModule: __dirname,
  components: {
    Socials,
  },
});
`);
  });
});
