const mockDBHelper = require('./mockDBHelper');

const convertPropNameToCamelCase = (name) => {
  return name.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
};

const mapObjectToCamelCased = (object) => {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const property = convertPropNameToCamelCase(key);
    const value = object[key];
    newObject[property] = value;
  });

  return newObject;
};

const executeQuery = async (query) => {
  const client = mockDBHelper.getClient();
  await client.connect();
  const res = await client.query(query);
  await client.end();

  return res.rows.map((rowObject) => mapObjectToCamelCased(rowObject));
};

module.exports = executeQuery;
