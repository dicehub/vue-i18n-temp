import mockConsole from 'jest-mock-console';
import { I18n } from '../I18n';

const nextTick = async () => new Promise((resolve) => process.nextTick(resolve));

describe('services/I18n', () => {
  afterAll(() => {
    fetchMock.dontMock();
  });

  describe('With mocked window.fetch()', () => {
    const locales = {
      en: 'en',
      klingon: 'tlh',
    };

    const getFetchUrlMock = () => jest.fn((ll) => `http://dicehub.io/lang/${ll}.json`);

    const getDefaultTranslations = () => ({
      key: 'value',
      you: 'You',
      so: {
        deep: {
          key: 'so deep value',
        },
      },
      interpolated: '{value1} {value2}',
      interpolatedWithSpaces: '{ key1 }{key2   }    {    key3} {  key4}. {key5}',
      deep: {
        interpolated: 'result: {deep.interpolated.key}',
      },
      plural: 'Zero|First |    Other',
      pluralWithArgs: '{prefix0}: Zero | {prefix1}: First | {prefixDefault}: Other',
    });

    const getKlingonTranslations = () => ({
      you: 'SoH',
      pluralKeyKlingon: "pagh | wa’  | 'uy'",
    });

    beforeEach(() => {
      fetchMock.doMock();
      fetch.mockResponse(async (req) =>
        req.url.includes(`${locales.klingon}.json`)
          ? JSON.stringify(getKlingonTranslations())
          : JSON.stringify(getDefaultTranslations())
      );
    });

    afterEach(() => {
      fetch.resetMocks();
    });

    it('should construct the service without errors', async () => {
      const i18n = new I18n();

      expect(i18n).toBeInstanceOf(I18n);
      expect(i18n.locale).toBeUndefined();

      await nextTick();

      expect(fetch).toBeCalledTimes(1);
      expect(fetch.mock.calls[0]).toContain('en');
      expect(i18n.locale).toBe('en');
      expect(document.querySelector('html').getAttribute('lang')).toBe('en');
    });

    it('should use option in the constructor', async () => {
      const getFetchUrl = getFetchUrlMock();
      const locale = locales.klingon;
      const i18n = new I18n({
        locale,
        getFetchUrl,
      });

      await nextTick();

      expect(i18n.locale).toBe(locale);
      expect(i18n.getFetchUrl).toBe(getFetchUrl);
      expect(fetch).toBeCalledTimes(2, 'first for fallbackLocale, second for the provided locale');
      expect(fetch.mock.calls[0]).toContain('http://dicehub.io/lang/en.json');
      expect(fetch.mock.calls[1]).toContain('http://dicehub.io/lang/tlh.json');
      expect(getFetchUrl.mock.calls[0]).toContain(I18n.DEFAULT_LOCALE);
      expect(getFetchUrl.mock.calls[1]).toContain(locale);
      expect(document.querySelector('html').getAttribute('lang')).toBe(locale);
    });

    it('should produce an error if options.getFetchUrl is not a type of "function"', async () => {
      expect(
        () =>
          new I18n({
            getFetchUrl: {},
          })
      ).toThrow('I18n.setFetchUrl() expected function, but "object" given instead');
    });

    it('should return translation from t() function', async () => {
      const i18n = new I18n();

      await nextTick();

      expect(i18n.t('key')).toBe('value');
      expect(i18n.t('so.deep.key')).toBe('so deep value');
    });

    it('should return translation from t() function and fallbackLocale', async () => {
      const locale = locales.klingon;
      const getFetchUrl = getFetchUrlMock();

      const i18n = new I18n({
        locale,
        getFetchUrl,
      });

      await nextTick();

      expect(fetch.mock.calls[0]).toContain('http://dicehub.io/lang/en.json');
      expect(fetch.mock.calls[1]).toContain('http://dicehub.io/lang/tlh.json');
      expect(i18n.t('unknown.key')).toBe('');
      expect(i18n.t('you')).toBe('SoH');
      expect(i18n.t('so.deep.key')).toBe('so deep value');
    });

    it("should interpolate values correctly whenever it's possible", async () => {
      const i18n = new I18n();

      await nextTick();

      expect(i18n.t('interpolated')).toBe('{value1} {value2}');
      expect(i18n.t('interpolated', {})).toBe('{value1} {value2}');
      expect(i18n.t('interpolated', null)).toBe('{value1} {value2}');
      expect(i18n.t('interpolated', { value1: 'interpolatedValue1' })).toBe(
        'interpolatedValue1 {value2}'
      );
      expect(i18n.t('interpolated', { value2: 'interpolatedValue2' })).toBe(
        '{value1} interpolatedValue2'
      );
      expect(
        i18n.t('interpolated', {
          value1: '<a href="//you.are/hacked!">click me please!</a>',
          value2: 'interpolatedValue2',
        })
      ).toBe('<a href="//you.are/hacked!">click me please!</a> interpolatedValue2');
      expect(
        i18n.t('deep.interpolated', {
          deep: { interpolated: { key: 'deep interpolated value' } },
        })
      ).toBe('result: deep interpolated value');
      expect(
        i18n.t('interpolatedWithSpaces', {
          key1: 'value-1',
          key2: 'value=2',
          key3: 'value/3',
          key4: 'value 4',
          key5: 'value{5}',
        })
      ).toBe('value-1value=2    value/3 value 4. value{5}');
    });

    it('should return translation from ti() function', async () => {
      const i18n = new I18n();

      await nextTick();

      expect(i18n.ti('plural', 0)).toBe('Zero');
      expect(i18n.ti('plural', 1)).toBe('First');
      expect(i18n.ti('plural', 2)).toBe('Other');
      expect(i18n.ti('plural', -1)).toBe('Other');
      expect(i18n.ti('plural', null)).toBe('Other');
      expect(i18n.ti('plural')).toBe('Other');
    });

    it('should support interpolation in ti()', async () => {
      const i18n = new I18n();

      await nextTick();

      const prefixes = {
        prefixDefault: 'Def',
        prefix0: '0',
        prefix1: '1',
      };

      expect(i18n.ti('pluralWithArgs', 0, prefixes)).toBe('0: Zero');
      expect(i18n.ti('pluralWithArgs', 1, prefixes)).toBe('1: First');
      expect(i18n.ti('pluralWithArgs', 2, prefixes)).toBe('Def: Other');
      expect(i18n.ti('pluralWithArgs', -1, prefixes)).toBe('Def: Other');
      expect(i18n.ti('pluralWithArgs', null, prefixes)).toBe('Def: Other');
      expect(i18n.ti('pluralWithArgs', undefined, prefixes)).toBe('Def: Other');
    });

    it('should return translation from ti() function and fallbackLocale', async () => {
      const locale = locales.klingon;
      const i18n = new I18n({
        locale,
        getFetchUrl: getFetchUrlMock(),
      });

      await nextTick();

      expect(i18n.ti('unknown.key')).toBe('');
      expect(i18n.ti('plural')).toBe('Other');
      expect(i18n.ti('plural', 0)).toBe('Zero');
      expect(i18n.ti('pluralKeyKlingon', 0)).toBe('pagh');
      expect(i18n.ti('pluralKeyKlingon', 1)).toBe('wa’');
      expect(i18n.ti('pluralKeyKlingon', 10)).toBe("'uy'");
    });

    it('shold allow to set locale on the fly', async () => {
      const i18n = new I18n({
        getFetchUrl: getFetchUrlMock(),
      });

      await nextTick();

      expect(i18n.t('you')).toBe('You');

      i18n.setLocale(locales.klingon);

      await nextTick();

      expect(i18n.t('you')).toBe('SoH');
    });
  });

  describe('With fetching problems', () => {
    let restoreConsole;

    beforeEach(() => {
      fetchMock.doMock();
      restoreConsole = mockConsole();
    });

    afterEach(() => {
      fetch.resetMocks();
      restoreConsole();
    });

    it('should notify about unability to fetch translations on network abort', async () => {
      fetch.mockAbort();

      expect(() => new I18n()).not.toThrowError();

      await nextTick();

      expect(console.error).toBeCalledTimes(1);
      expect(console.error.mock.calls[0]).toContain(
        'Unable to load locale "%s" because of error:',
        'en'
      );
    });

    it('should notify about unability to fetch translations on the failed response', async () => {
      fetch.mockReject();
      expect(() => new I18n()).not.toThrowError();

      await nextTick();

      expect(console.error).toBeCalledTimes(1);
      expect(console.error.mock.calls[0]).toContain(
        'Unable to load locale "%s" because of error:',
        'en'
      );
    });

    it('should notify if cannot parse response as JSON', async () => {
      fetch.mockResponse('non-json object');

      expect(() => new I18n()).not.toThrowError();
      await nextTick();

      expect(console.error).toBeCalledTimes(1);
      expect(console.error.mock.calls[0]).toContain(
        'Unable to load locale "%s" because of error:',
        'en'
      );
      expect(console.error.mock.calls[0][2].message).toContain('Unexpected token o in JSON');
    });
  });
});
