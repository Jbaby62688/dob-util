'use strict';

const moment = require('moment');
const cheerio = require('cheerio');
const {
  DobLogApi
} = require('@dob/log');
const UtilConstant = require('../constant/utilConstant');
const UtilValueError = require('../error/utilValueError');

class UtilApi {
  /**
   * @description 检查值
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Object} param1.value 值
   * @param {Object} param2
   * @param {Object} param2.type 类型
   * @param {Object} [param1.rule = {}] 规则
   * @param {Object} param3
   * @param {Boolean} [param3.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {Boolean}
   * 
   * @throws {UtilValueError}
   */
  static checkValue(
    {
      value
    },
    {
      type,
      rule = {},
    },
    {
      throwErrorFlag = true,
    } = {}
  ) {
    const identifier = 'UtilApi::checkValue';

    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );

    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);

    try {
      //处理参数
      logger?.debug('value:', value);
      logger?.debug('type:', type.toString());
      logger?.debug('rule:', rule);
      logger?.debug('throwErrorFlag:', throwErrorFlag);

      let {
        allowUndefined = false,
        allowNull = false,
      } = rule;

      //根据数值类型检查
      //--undefined
      if (value === undefined) {
        if (allowUndefined !== true) {
          throw new UtilValueError('不能为undefined');
        }
      }
      //--null
      else if (value === null) {
        if (allowNull !== true) {
          throw new UtilValueError('不能为null');
        }
      }
      //--其他
      else {
        //检查类型
        switch (type) {
          //布尔型
          case UtilConstant.VALUE_TYPE_BOOLEAN:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Boolean]') {
              throw new UtilValueError('不是布尔型');
            }

            break;

          //数字型
          case UtilConstant.VALUE_TYPE_NUMBER:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Number]' || Number.isNaN(value)) {
              throw new UtilValueError('不是数字型');
            }

            break;

          //字符串型
          case UtilConstant.VALUE_TYPE_STRING:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object String]') {
              throw new UtilValueError('不是字符串型');
            }

            break;

          //数组型
          case UtilConstant.VALUE_TYPE_ARRAY:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Array]') {
              throw new UtilValueError('不是数组型');
            }

            break;

          //对象型
          case UtilConstant.VALUE_TYPE_OBJECT:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Object]') {
              throw new UtilValueError('不是对象型');
            }

            break;

          //函数型
          case UtilConstant.VALUE_TYPE_FUNCTION:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Function]') {
              throw new UtilValueError('不是函数型');
            }

            break;

          //日期型
          case UtilConstant.VALUE_TYPE_DATE:
            //检查类型
            if (Object.prototype.toString.call(value) !== '[object Date]') {
              throw new UtilValueError('不是日期型');
            }

            break;

          //默认
          default:
            throw new UtilValueError('未知类型');
        }

        let {
          allowEmpty,
          gte,
          gt,
          eq,
          lt,
          lte,
          ne,
          list,
          integer,
          mobile,
          email,
          html,
          checkHandler
        } = rule;

        //规则检查
        if (allowEmpty === true) {
          if (type === UtilConstant.VALUE_TYPE_STRING) {
            if (value === '') {
              return true;
            }
          }
        }

        if (gte !== undefined) {
          if (
            this.checkValue(
              {
                value: gte
              },
              {
                type: UtilConstant.VALUE_TYPE_NUMBER
              },
              {
                throwErrorFlag: false,
              }
            ) === false
          ) {
            throw new UtilValueError('gte规则配置错误');
          }

          if (type === UtilConstant.VALUE_TYPE_NUMBER) {
            if (value < gte) {
              throw new UtilValueError('gte规则检查不通过');
            }
          }
          else if (type === UtilConstant.VALUE_TYPE_STRING) {
            if (value.length < gte) {
              throw new UtilValueError('gte规则检查不通过');
            }
          }
          else if (type === UtilConstant.VALUE_TYPE_ARRAY) {
            if (value.length < gte) {
              throw new UtilValueError('gte规则检查不通过');
            }
          }
        }

        if (gt !== undefined) {
          if (
            this.checkValue(
              {
                value: gt
              },
              {
                type: UtilConstant.VALUE_TYPE_NUMBER
              },
              {
                throwErrorFlag: false,
              }
            ) === false
          ) {
            throw new UtilValueError('gt规则配置错误');
          }

          if (type === UtilConstant.VALUE_TYPE_NUMBER) {
            if (value <= gt) {
              throw new UtilValueError('gt规则检查不通过');
            }
          }
          else if (type === UtilConstant.VALUE_TYPE_STRING) {
            if (value.length <= gt) {
              throw new UtilValueError('gt规则检查不通过');
            }
          }
          else if (type === UtilConstant.VALUE_TYPE_ARRAY) {
            if (value.length <= gt) {
              throw new UtilValueError('gt规则检查不通过');
            }
          }
        }

        if (eq !== undefined) {
          if (value !== eq) {
            throw new UtilValueError('eq规则检查不通过');
          }
        }

        if (lt !== undefined) {
          if (
            this.checkValue(
              {
                value: lt
              },
              {
                type: UtilConstant.VALUE_TYPE_NUMBER
              },
              {
                throwErrorFlag: false,
              }
            ) === false
          ) {
            throw new UtilValueError('lt规则配置错误');
          }

          if (type === UtilConstant.VALUE_TYPE_NUMBER) {
            if (value >= lt) {
              throw new UtilValueError('lt规则检查不通过');
            }
          }

          if (type === UtilConstant.VALUE_TYPE_STRING) {
            if (value.length >= lt) {
              throw new UtilValueError('lt规则检查不通过');
            }
          }

          if (type === UtilConstant.VALUE_TYPE_ARRAY) {
            if (value.length >= lt) {
              throw new UtilValueError('lt规则检查不通过');
            }
          }
        }

        if (lte !== undefined) {
          if (
            this.checkValue(
              {
                value: lte
              },
              {
                type: UtilConstant.VALUE_TYPE_NUMBER
              },
              {
                throwErrorFlag: false,
              }
            ) === false
          ) {
            throw new UtilValueError('lte规则配置错误');
          }

          if (type === UtilConstant.VALUE_TYPE_NUMBER) {
            if (value > lte) {
              throw new UtilValueError('lte规则检查不通过');
            }
          }

          if (type === UtilConstant.VALUE_TYPE_STRING) {
            if (value.length > lte) {
              throw new UtilValueError('lte规则检查不通过');
            }
          }

          if (type === UtilConstant.VALUE_TYPE_ARRAY) {
            if (value.length > lte) {
              throw new UtilValueError('lte规则检查不通过');
            }
          }
        }

        if (ne !== undefined) {
          if (value === ne) {
            throw new UtilValueError('ne规则检查不通过');
          }
        }

        if (list !== undefined) {
          if (
            this.checkValue(
              {
                value: list
              },
              {
                type: UtilConstant.VALUE_TYPE_ARRAY
              },
              {
                throwErrorFlag: false
              }
            ) === false
          ) {
            throw new UtilValueError('list规则配置错误');
          }

          if (list.indexOf(value) === -1) {
            throw new UtilValueError('list规则检查不通过');
          }
        }

        if (integer === true) {
          if (Number.isInteger(value) === false) {
            throw new UtilValueError('integer规则检查不通过');
          }
        }

        if (mobile === true) {
          if (/^1[3456789]\d{9}$/.test(value) === false) {
            throw new UtilValueError('mobile规则检查不通过');
          }
        }

        if (email === true) {
          if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value) === false) {
            throw new UtilValueError('email规则检查不通过');
          }
        }

        if (html === true) {
          let rootNode = cheerio.load(value);
          let ignoreTagList = ['script', 'iframe', 'frame'];
          for (let i = 0; i < ignoreTagList.length; i++) {
            let ignoreTag = ignoreTagList[i];
            let invalidDomList = rootNode(ignoreTag);
            if (invalidDomList.length > 0) {
              throw new UtilValueError(`不能包含${ignoreTag}标签`);
            }
          }
        }

        if (checkHandler !== undefined) {
          if (
            this.checkValue(
              {
                value: checkHandler
              },
              {
                type: UtilConstant.VALUE_TYPE_FUNCTION
              },
              {
                throwErrorFlag: false
              }
            ) === false
          ) {
            throw new UtilValueError('checkHandler规则配置错误');
          }

          if (
            checkHandler(
              {
                value
              }
            ) === false
          ) {
            throw new UtilValueError('checkHandler规则检查不通过');
          }
        }
      }

      //返回
      return true;
    }
    catch (error) {
      //抛出错误
      if (throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return false;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  };


  /**
   * @description 从http请求中获取参数
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Object} param1.request 请求
   * @param {Array} param1.config 配置
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag=true] 抛出错误标志
   * 
   * @returns {Object}
   */
  static getValueFromHttpRequest(
    {
      request,
      config
    },
    {
      throwErrorFlag = true,
    } = {}
  ) {
    const identifier = 'UtilApi::getValueFromHttpRequest';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //初始化变量
      let returnValueMap = {};

      //检查参数
      if (
        this.checkValue(
          {
            value: config
          },
          {
            type: UtilConstant.VALUE_TYPE_ARRAY
          },
          {
            throwErrorFlag: false
          }
        ) === false
      ) {
        return returnValueMap;
      }

      //获取值
      config.forEach(item => {
        let { field, type, rule, convert } = item;
        let value;

        if (request?.params?.[field] !== undefined) {
          value = request.params[field];
        }
        else if (request?.body?.[field] !== undefined) {
          value = request.body[field];
        }
        else if (request?.query?.[field] !== undefined) {
          value = request.query[field];
        }
        else if (request?.headers?.[field.toLowerCase()] !== undefined) {
          value = request.headers[field.toLowerCase()];
        }

        if (value !== undefined && value !== null) {
          if (convert === true) {
            switch (type) {
              case UtilConstant.VALUE_TYPE_NUMBER:
                value = Number(value);
                break;
            }
          }
        }

        if (rule !== undefined) {
          try {
            this.checkValue(
              {
                value
              },
              {
                type,
                rule
              }
            );
          }
          catch (error) {
            if(error instanceof UtilValueError) {
              error.field = field;
            }

            throw error;
          }
        }

        returnValueMap[field] = value;
      });

      //返回
      return returnValueMap;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return {};
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 从http请求中获取分页参数
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {Object} param1.request 请求
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {Object}
   */
  static getOffsetAndLimitFromHttpRequest(
    {
      request
    },
    {
      throwErrorFlag = false
    } = {}
  ) {
    const identifier = 'UtilApi::getOffsetAndLimitFromHttpRequest';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //初始化变量
      let returnData = {};

      //获取参数
      let offset = request.query.offset !== undefined ? Number(request.query.offset) : request.query.offset;
      let limit = request.query.limit !== undefined ? Number(request.query.limit) : request.query.limit;
      let page = request.query.page !== undefined ? Number(request.query.page) : request.query.page;
      let size = request.query.size !== undefined ? Number(request.query.size) : request.query.size;
      logger?.debug('offset:', offset);
      logger?.debug('limit:', limit);
      logger?.debug('page:', page);
      logger?.debug('size:', size);

      //处理offset,limit
      if (
        this.checkValue(
          {
            value: offset
          },
          {
            type: UtilConstant.VALUE_TYPE_NUMBER,
            rule: {
              ...UtilConstant.VALUE_RULE_UNSIGNED_BIGINT
            }
          },
          {
            throwErrorFlag: false
          }
        ) === true
        && this.checkValue(
          {
            value: limit,
          },
          {
            type: UtilConstant.VALUE_TYPE_NUMBER,
            rule: {
              ...UtilConstant.VALUE_RULE_POSITIVE_BIGINT
            }
          },
          {
            throwErrorFlag: false
          }
        ) === true
      ) {
        returnData = { offset, limit };
      }
      //处理page,size
      else if (
        this.checkValue(
          {
            value: page
          },
          {
            type: UtilConstant.VALUE_TYPE_NUMBER,
            rule: {
              ...UtilConstant.VALUE_RULE_POSITIVE_BIGINT
            }
          },
          {
            throwErrorFlag: false
          }
        ) === true
        && this.checkValue(
          {
            value: size,
          },
          {
            type: UtilConstant.VALUE_TYPE_NUMBER,
            rule: {
              ...UtilConstant.VALUE_RULE_POSITIVE_BIGINT
            }
          },
          {
            throwErrorFlag: false
          }
        ) === true
      ) {
        offset = (page - 1) * size;
        limit = size;
        returnData = { offset, limit };
      }
      else {
        returnData = {};
      }

      //返回
      return returnData;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return {};
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 等待
   * 
   * @static
   * 
   * @async
   * 
   * @param {object} param1
   * @param {number} param1.millisecond 毫秒
   * @param {object} param2
   * @param {boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {Promise}
   */
  static async sleep(
    {
      millisecond
    }
  ) {
    const identifier = 'UtilApi::sleep';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查参数
      logger?.debug('millisecond:', millisecond);
      this.checkValue(
        {
          value: millisecond
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_POSITIVE_INT
          }
        }
      );

      //返回
      return new Promise(
        (resolve, reject) => {
          setTimeout(
            () => {
              resolve();
            },
            millisecond
          );
        }
      );
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return new Promise(
          (resolve, reject) => {
            setTimeout(
              () => {
                resolve();
              },
              1000
            );
          }
        );
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 生成随机整数(半闭半开区间)
   * 
   * @static
   * 
   * @param {object} param1
   * @param {number} param1.min 最小值
   * @param {number} param1.max 最大值
   * @param {object} param2
   * @param {boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {number}
   */
  static generateRandomNumber(
    {
      min,
      max
    },
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'UtilApi::generateRandomNumber';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查参数
      logger?.debug('min:', min);
      this.checkValue(
        {
          value: min
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_INT
          }
        }
      );

      logger?.debug('max:', max);
      this.checkValue(
        {
          value: max
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_INT
          }
        }
      );

      if(min >= max) {
        throw new Error('最小值不能大于等于最大值');
      }

      //生成随机数
      let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      //返回
      return randomNumber;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return 0;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 生成随机字符串
   * 
   * @static
   * 
   * @param {object} param1
   * @param {number} param1.length 长度
   * @param {boolean} [param1.lowercase = true] 是否包含小写字母
   * @param {boolean} [param1.uppercase = true] 是否包含大写字母
   * @param {boolean} [param1.number = true] 是否包含数字
   * @param {string} [param1.otherString = ''] 其他字符串
   * @param {object} param2
   * @param {boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {string}
   */
  static generateRandomString(
    {
      length,
      lowercase = true,
      uppercase = true,
      number = true,
      otherString = ''
    },
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'UtilApi::generateRandomString';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //定义字符集
      const lowercaseString = 'abcdefghijklmnopqrstuvwxyz';
      const uppercaseString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numberString = '0123456789';

      //检查参数
      logger?.debug('length:', length);
      this.checkValue(
        {
          value: length
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_POSITIVE_INT
          }
        }
      );

      logger?.debug('lowercase:', lowercase);
      this.checkValue(
        {
          value: lowercase
        },
        {
          type: UtilConstant.VALUE_TYPE_BOOLEAN
        }
      );

      logger?.debug('uppercase:', uppercase);
      this.checkValue(
        {
          value: uppercase
        },
        {
          type: UtilConstant.VALUE_TYPE_BOOLEAN
        }
      );

      logger?.debug('number:', number);
      this.checkValue(
        {
          value: number
        },
        {
          type: UtilConstant.VALUE_TYPE_BOOLEAN
        }
      );

      logger?.debug('otherString:', otherString);
      this.checkValue(
        {
          value: otherString
        },
        {
          type: UtilConstant.VALUE_TYPE_STRING
        }
      );

      //生成字符序列
      let possibleString = '';

      if (lowercase === true) {
        possibleString += lowercaseString;
      }

      if (uppercase === true) {
        possibleString += uppercaseString;
      }

      if (number === true) {
        possibleString += numberString;
      }

      if (otherString !== undefined) {
        possibleString += otherString;
      }

      if(possibleString.length === 0) {
        throw new Error('没有可用字符');
      }

      //生成随机字符串
      let randomString = '';
      for (let i = 0; i < length; i++) {
        let index = this.generateRandomNumber(
          {
            min: 0,
            max: possibleString.length - 1
          }
        );
        randomString += possibleString.charAt(index);
      }

      //返回
      return randomString;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return '';
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 获取当前时间戳
   * 
   * @static
   * 
   * @param {object} param1
   * @param {Date} [param1.date = new Date()] 日期
   * @param {object} param2
   * @param {boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {number}
   */
  static getCurrentTimestamp(
    {
      date = new Date()
    } = {},
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'UtilApi::getCurrentTimestamp';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //获取时间戳
      let timestamp = moment(date).unix();

      //返回
      return timestamp;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return 0;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
    
  }


  /**
   * @description 整数转浮点数
   * 
   * @static
   * 
   * @param {object} param1
   * @param {number} param1.value 值
   * @param {object} param2
   * @param {number} [param2.precision = 2] 精度
   * @param {object} param3
   * @param {boolean} [param3.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {number}
   */
  static intToFloat(
    {
      value
    },
    {
      precision = 2
    } = {},
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'UtilApi::intToFloat';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查参数
      logger?.debug('value:', value);
      this.checkValue(
        {
          value
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_BIGINT
          }
        }
      );

      logger?.debug('precision:', precision);
      this.checkValue(
        {
          value: precision
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            gte: 1,
            lte: 6
          }
        }
      );
      
      //转换
      value = value / Math.pow(10, precision);

      //返回
      return value;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return 0;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 浮点数转整数
   * 
   * @static
   * 
   * @param {object} param1
   * @param {number} param1.value 值
   * @param {object} param2
   * @param {number} [param2.precision = 2] 精度
   * @param {object} param3
   * @param {boolean} [param3.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {number}
   */
  static floatToInt(
    {
      value
    },
    {
      precision = 2
    } = {},
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'UtilApi::floatToInt';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //检查参数
      logger?.debug('value:', value);
      this.checkValue(
        {
          value
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            ...UtilConstant.VALUE_RULE_DOUBLE
          }
        }
      );

      logger?.debug('precision:', precision);
      this.checkValue(
        {
          value: precision
        },
        {
          type: UtilConstant.VALUE_TYPE_NUMBER,
          rule: {
            gte: 1,
            lte: 6
          }
        }
      );

      //转换
      value = Math.floor(value * Math.pow(10, precision));
      
      //返回
      return value;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return 0;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }
}

module.exports = UtilApi;