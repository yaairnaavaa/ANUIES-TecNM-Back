function flatten(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flatten(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  console.log(res);
  return res;
}

module.exports = flatten;
