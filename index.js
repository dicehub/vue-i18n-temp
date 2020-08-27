import Vue from 'vue';
import { getComponentPath } from './utils';
import { I18n } from './services';

// TODO: remove global I18n instance usage
const i18nGlobalInstance = new I18n();

const DHI18nPlugin = {
  install(VueInstance, options = {}) {
    if (options.getFetchUrl) {
      i18nGlobalInstance.setFetchUrl(options.getFetchUrl);
    }

    if (options.locale) {
      i18nGlobalInstance.setLocale(options.locale);
    }

    VueInstance.prototype.$i18n = new Vue({
      data: () => ({
        instance: i18nGlobalInstance,
      }),
    });

    VueInstance.mixin({
      computed: {
        $t() {
          return (slug, vars = {}) => {
            const { instance } = this.$i18n;

            return instance.t(slug, vars) || instance.t(`${getComponentPath(this)}.${slug}`, vars);
          };
        },

        $ti() {
          return (slug, number, vars = {}) => {
            const { instance } = this.$i18n;

            return (
              instance.ti(slug, number, vars) ||
              instance.ti(`${getComponentPath(this)}.${slug}`, number, vars)
            );
          };
        },
      },
    });
  },
};

export { DHI18nPlugin as default, i18nGlobalInstance as i18n };
