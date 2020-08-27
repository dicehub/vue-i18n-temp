import Vue from 'vue';
import { getValueByPath } from '../utils';

export class I18n {
  static /* readonly */ DEFAULT_LOCALE = 'en';
  static /* private readonly */ interpolationRE = /{([^}]+)}/gm;
  static /* private readonly */ pluralSymbolRE = /%s/gm;
  static /* private readonly */ pluralSplitRE = /\s*\|\s*/;

  /* private */ getFetchUrl = (locale) => locale;

  constructor(options = {}) {
    /* private readonly */ this.fallbackLocale = I18n.DEFAULT_LOCALE;
    /* private readonly */ this.messages = {};

    if (options.getFetchUrl != null) this.setFetchUrl(options.getFetchUrl);

    this.setLocale(options.locale || this.fallbackLocale);
  }

  t(slug, vars = {}) {
    const translation =
      getValueByPath(this.messages[this.locale], slug) ||
      getValueByPath(this.messages[this.fallbackLocale], slug) ||
      '';

    return this.interpolate(translation, vars);
  }

  ti(slug, number, vars) {
    const translation = this.t(slug, vars);
    const variants = translation.replace(I18n.pluralSymbolRE, number).split(I18n.pluralSplitRE);

    if (number === 0) {
      return variants[0];
    }

    if (number === 1) {
      return variants[1];
    }

    return variants[2] || '';
  }

  /* private */ setFetchUrl(fn) {
    if (typeof fn === 'function') {
      this.getFetchUrl = fn;
    } else {
      throw new Error(`I18n.setFetchUrl() expected function, but "${typeof fn}" given instead`);
    }
  }

  async setLocale(locale) {
    if (locale !== this.fallbackLocale) {
      await this.loadLocale(this.fallbackLocale);
    }

    if (this.locale === locale) {
      return;
    }

    await this.loadLocale(locale);

    this.locale = locale;
    this.setDocumentLocale();
  }

  /* private */ setDocumentLocale() {
    document.querySelector('html').setAttribute('lang', this.locale);
  }

  /* private */ async loadLocale(locale) {
    try {
      const url = this.getFetchUrl(locale);
      const r = await fetch(url);
      const data = await r.json();

      this.saveLocale(locale, data);
    } catch (err) {
      console.error('Unable to load locale "%s" because of error:', locale, err);
    }
  }

  /* private */ saveLocale(locale, data) {
    Vue.set(this.messages, locale, data);
  }

  /* private */ interpolate(message, vars) {
    return message.replace(
      I18n.interpolationRE,
      (original, slug) => getValueByPath(vars, slug.trim()) || original
    );
  }
}
