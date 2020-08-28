export function getValueByPath(map, path) {
  const pathParts = String(path || '').split('.');
  let cursor = map;
  let key = null;

  for (let i = 0; i < pathParts.length; i++) {
    key = pathParts[i];

    if (cursor == null || cursor[key] == null) return null;

    cursor = cursor[key];
  }

  return cursor;
}
