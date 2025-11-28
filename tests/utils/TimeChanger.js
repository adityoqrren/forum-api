function addTimeByMinutes(minutesToAdd) {
  const newDate = new Date();
  const currentMinutes = newDate.getMinutes();

  newDate.setMinutes(currentMinutes + minutesToAdd);
  return newDate;
}

function minTimeByMinutes(minutesToSubstract) {
  const newDate = new Date();
  const currentMinutes = newDate.getMinutes();

  newDate.setMinutes(currentMinutes - minutesToSubstract);
  return newDate;
}

module.exports = { addTimeByMinutes, minTimeByMinutes };
