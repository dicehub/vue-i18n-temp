import Vue from 'vue';

function deepFind(n, o) {
  let l;
  const r = o.split('.');
  let t = n;

  for (l = 0; l < r.length; ++l) {
    if (t == null || t[r[l]] == null) return;

    t = t[r[l]];
  }

  return t;
}

function getComponentPath(component) {
  const path = component.$options.$componentModule || '';

  return path.replace(/\.\.\//g, '').toLowerCase();
}

export const i18n = {
  getFetchUrl: (str) => str,
  fallbackLocale: 'en',
  locale: null,
  messages: {},

  t(slug, vars = {}) {
    let translation = deepFind(this.messages[this.locale], slug);

    // Fallback
    if (!translation) {
      // TODO: debug locale here
      translation = deepFind(this.messages[this.fallbackLocale], slug);
    }

    if (!translation) {
      return '';
    }

    return this._interpolate(translation, vars);
  },

  ti(slug, number, vars) {
    const translation = this.t(slug, vars);
    const variants = translation.replace(/%s/gm, number).split(/\s+\|\s+/);

    if (number === 0) {
      return variants[0];
    }

    if (number === 1) {
      return variants[1];
    }

    return variants[2];

    // return translation;
  },

  async setLocale(locale) {
    if (this.fallbackLocale !== locale) {
      this.addLocale(this.fallbackLocale);
    }

    if (this.locale === locale) {
      return;
    }

    this.addLocale(locale);

    document.querySelector('html').setAttribute('lang', locale);
    this.locale = locale;

    // localStorage.setItem('language', profile.info.language);
  },

  addLocale(locale) {
    return fetch(this.getFetchUrl(locale))
      .then((r) => r.json())
      .then((data) => {
        Vue.set(this.messages, locale, data);
      });
  },

  _interpolate(message, vars) {
    const regex = /{([^}]+)}/gm;

    return message.replace(regex, (_, slug) => deepFind(vars, slug) || _);
  },
};

export default {
  install(VueInstance, options = {}) {
    if (options.getFetchUrl) {
      i18n.getFetchUrl = options.getFetchUrl;
    }

    if (options.locale) {
      i18n.setLocale(options.locale);
    }

    VueInstance.prototype.$i18n = new Vue({
      data: () => ({ instance: i18n }),
    });

    VueInstance.mixin({
      computed: {
        $t() {
          return (slug, vars = {}) => {
            const message = this.$i18n.instance.t(slug, vars);

            // Component fallback
            if (!message) {
              const path = getComponentPath(this);

              return this.$i18n.instance.t(`${path}.${slug}`, vars);
            }

            return message;
          };
        },

        $ti() {
          return (slug, number, vars = {}) => {
            const message = this.$i18n.instance.ti(slug, number, vars);

            // Component fallback
            if (!message) {
              const path = getComponentPath(this);

              return this.$i18n.instance.ti(`${path}.${slug}`, number, vars);
            }

            return message;
          };
        },
      },
    });
  },
};
