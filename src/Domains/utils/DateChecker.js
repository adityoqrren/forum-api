function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

module.exports = isValidDate;
