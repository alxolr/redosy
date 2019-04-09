const safe = require('safer-regex');

function safeRegexp(rex) {
  try {
    safe(rex, true);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = safeRegexp;
