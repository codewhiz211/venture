export function createFieldName(field) {
  const words = field.replace(/([(,)&\-\/])/g, '').split(' ');
  const newName = [];

  for (const name of words) {
    newName.push(newName.length ? name.charAt(0).toUpperCase() + name.slice(1) : name.charAt(0).toLowerCase() + name.slice(1));
  }
  return newName.join('');
}
