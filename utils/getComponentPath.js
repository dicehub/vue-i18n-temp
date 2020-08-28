export function getComponentPath(component) {
  const path = component.$options.$componentModule || '';

  return path.replace(/\.\.\//g, '').toLowerCase();
}
