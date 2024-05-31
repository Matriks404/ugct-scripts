// From http://stackoverflow.com/questions/1353684
// Returns 'true' if variable d is a date object.
function isValidDate(d) {
  if ( Object.prototype.toString.call(d) !== "[object Date]" )
    return false;
  return !isNaN(d.getTime());
}