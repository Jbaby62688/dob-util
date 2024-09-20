'use strict';

const {
  DobUtilConstant,
  DobUtilApi
} = require('../index');

test(
  'defined',
  () => {
    expect(DobUtilApi).toBeDefined();
  }
);

test(
  'chechValue',
  () => {
    expect(
      DobUtilApi.checkValue(
        {
          value: 1
        },
        {
          type: DobUtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...DobUtilConstant.VALUE_RULE_BIGINT
          }
        }
      )
    ).toBe(true);
  }
);