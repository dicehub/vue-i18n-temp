module.exports = function(source, ...args) {
  const newSource = source.replace('export default {', 'export default { \n$componentModule: __dirname,');

  // Debug
  // console.log(newSource);

  return newSource;
};
