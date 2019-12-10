// Check whether the value is empty or not. Value can be anything - object, string, undefined, null
// Returns boolean value
const isEmpty = (value) => (
  value === undefined
  || value === null
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0)
);

module.exports = { isEmpty };
