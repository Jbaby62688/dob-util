'use strict';

class UtilValueError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = UtilValueError;