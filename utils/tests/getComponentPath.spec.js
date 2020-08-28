import Vue from 'vue';
import { getComponentPath } from '../getComponentPath';

describe('@dicehub/vue-18n/utils/getComponentPath', () => {
  it('should return path of the component added by loader', () => {
    const vm = new Vue({
      $componentModule: 'components/MyComponent',
    });

    expect(getComponentPath(vm)).toBe('components/mycomponent');
  });

  it('should remove directory "../" navigation part', () => {
    const vm = new Vue({
      $componentModule: '../components/MyComponent',
    });

    expect(getComponentPath(vm)).toBe('components/mycomponent');
  });

  it('should not fail if path is not set', () => {
    const vm = new Vue({});

    expect(getComponentPath(vm)).toBe('');
  });

  it('should not fail if path is null', () => {
    const vm = new Vue({
      $componentModule: null,
    });

    expect(getComponentPath(vm)).toBe('');
  });

  it('should not fail if path is empty', () => {
    const vm = new Vue({
      $componentModule: '',
    });

    expect(getComponentPath(vm)).toBe('');
  });
});
