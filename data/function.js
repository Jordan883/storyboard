const { ObjectId } = require('mongodb');

function checkId(string) {
  return ObjectId.isValid(string);
}
function checkString(string) {
  if (!string)
    return false;
  if (typeof string === 'string' || string instanceof String) {
    if (string.trim().length === 0)
      return false;
  } else {
    return false;
  }
  return true;
}

module.exports = {
  checkId;
  checkString;
}
