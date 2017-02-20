module.exports = {
  THROW(err) {
    throw err;
  },
  hasOwnProp(obj, propName) {
    return Object.prototype.hasOwnProperty.call(obj, propName);
  }
};
