const componentModulePathInjectionLine = '\n  $componentModule: __dirname,';

/* eslint-disable-next-line no-unused-vars */
const loader = (source, ..._args) =>
  source.replace(
    /export(s?\s*\.\s*|\s+)default(\s*(?:=\s*)?)((?:[A-z0-9_]+\s*\.\s*)?defineComponent\s*\(\s*)?{/,
    `export$1default$2$3{${componentModulePathInjectionLine}`
  );

module.exports = loader;
