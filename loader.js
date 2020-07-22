const loader = (source) => {
  const newSource = source.replace(
    /export default(\s*)(defineComponent\s*\()?{/,
    'export default$1$2{\n  $componentModule: __dirname,'
  );

  return newSource;
};

module.exports = loader;
