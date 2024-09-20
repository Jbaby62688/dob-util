'use strict';

class UtilConstant {
  static VALUE_TYPE_BOOLEAN = Symbol('boolean');
  static VALUE_TYPE_NUMBER = Symbol('number');
  static VALUE_TYPE_STRING = Symbol('string');
  static VALUE_TYPE_ARRAY = Symbol('array');
  static VALUE_TYPE_OBJECT = Symbol('object');
  static VALUE_TYPE_FUNCTION = Symbol('function');
  static VALUE_TYPE_DATE = Symbol('date');

  //tinyint
  static VALUE_RULE_TINYINT = {
    gte: -128,
    lte: 127,
    integer: true
  }

  static VALUE_RULE_UNSIGNED_TINYINT = {
    ...this.VALUE_RULE_TINYINT,
    gte: 0,
    lte: 255
  }

  static VALUE_RULE_POSITIVE_TINYINT = {
    ...this.VALUE_RULE_UNSIGNED_TINYINT,
    gte: 1
  }

  //int
  static VALUE_RULE_INT = {
    gte: -Math.pow(2, 31),
    lte: Math.pow(2, 31) - 1,
    integer: true
  }

  static VALUE_RULE_UNSIGNED_INT = {
    ...this.VALUE_RULE_INT,
    gte: 0,
    lte: Math.pow(2, 32) - 1
  }

  static VALUE_RULE_POSITIVE_INT = {
    ...this.VALUE_RULE_UNSIGNED_INT,
    gte: 1
  }

  //bigint
  static VALUE_RULE_BIGINT = {
    gte: Number.MIN_SAFE_INTEGER,
    lte: Number.MAX_SAFE_INTEGER,
    integer: true
  }
  
  static VALUE_RULE_UNSIGNED_BIGINT = {
    ...this.VALUE_RULE_BIGINT,
    gte: 0,
  }

  static VALUE_RULE_POSITIVE_BIGINT = {
    ...this.VALUE_RULE_UNSIGNED_BIGINT,
    gte: 1
  }

  //double
  static VALUE_RULE_DOUBLE = {
    gte: -Number.MAX_VALUE,
    lte: Number.MAX_VALUE
  }

  static VALUE_RULE_UNSIGNED_DOUBLE = {
    ...this.VALUE_RULE_DOUBLE,
    gte: 0
  }

  static VALUE_RULE_POSITIVE_DOUBLE = {
    ...this.VALUE_RULE_UNSIGNED_DOUBLE,
    gt: 0
  }

  //string
  static VALUE_RULE_STRING = {
    gte: 0,
    lte: 255
  }

  static VALUE_RULE_NONEMPTY_STRING = {
    ...this.VALUE_RULE_STRING,
    gte: 1
  }

  static VALUE_RULE_TEXT = {
    gte: 0,
    lte: 65535
  }

  static VALUE_RULE_NONEMPTY_TEXT = {
    ...this.VALUE_RULE_TEXT,
    gte: 1
  }
}

module.exports = UtilConstant;