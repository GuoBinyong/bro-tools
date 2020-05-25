(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.broTools = {}));
}(this, (function (exports) { 'use strict';

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var objectWithoutProperties = _objectWithoutProperties;

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  /*
   使用属性描述来定义属性的原因：
   - 为了不让 for...in 等类似的操作遍历这些定义在原型上的方法或属性，需要将属性设置为不可枚举的；
   - 为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；
   */
  var propertyDescriptors = {
    //去重：开始

    /*
    getNoRepeats()
    获取去除重复项目后的数组
     ## 注意
    - 该方法不改原数组，会返回一个新的数组；
    - 该方法是通过 严格相等 `===` 运算符来判断 数组的元素是否重复的；
    */
    getNoRepeats: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        return this.filter(function (currentItem, index, arr) {
          return index === arr.indexOf(currentItem);
        });
      }
    },

    /**
     getNoRepeatsUseRepeatTest(isRepeated)
     根据重复测试函数 `isRepeated` 来获取去除重复项目后的新数组
      - @param isRepeated  : (item1,item2)=> boolean      重复油测试函数，传入被测试的2个项目，返回布尔值，表示这2个项目是否是重复的；
     - @returns : Array  返回去除重复项目后的新数组
      ## 注意
     - 该方法不改原数组，会返回一个新的数组；
     - 该方法是通过 isRepeated 函数来判断 数组的元素是否重复的；
     */
    getNoRepeatsUseRepeatTest: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(isRepeated) {
        return this.filter(function (currentItem, index, arr) {
          return index === arr.findIndex(function (findItem) {
            return isRepeated(findItem, currentItem);
          });
        });
      }
    },
    //去重：结束
    //安全操作：开始

    /*
    JavaScript 数组中与遍历相关的方法都是非安全 和 非严谨的，当在遍历时增删原始数组的元素时，会引出问题；
    详情请参考文章：https://www.jianshu.com/p/6dd641d0c13d
     以下 安全操作 的方法便是用来解决这些问题的；
     */

    /**
     * safelyOperateIndexs(indexList, operation, thisValue)
     * 安全操作指定的索引
     * @param indexList : [Index]   需要被操作的索引数组
     * @param operation : (currentValue,currentIndex,currentArray)=>Void     执行的操作
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Item]   被操作的元素列表
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>Void
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     *
     */
    safelyOperateIndexs: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(indexList, operation, thisValue) {
        var _this = this;

        if (thisValue == undefined) {
          thisValue = this;
        }

        var itemList = this.filter(function (currentValue, index) {
          return indexList.includes(index);
        });
        itemList.forEach(function (currentValue) {
          var currentIndex = _this.indexOf(currentValue);

          operation.call(thisValue, currentValue, currentIndex, _this);
        });
        return itemList;
      }
    },

    /**
     * safelyOperateItems(itemList, operation, thisValue)
     * 安全操作指定的元素
     * @param itemList : [Item]   需要被操作的元素的数组
     * @param operation : (currentValue,currentIndex,currentArray)=>Void     执行的操作
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Index]   被操作的元素的索引的列表；
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>Void
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     *
     */
    safelyOperateItems: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(itemList, operation, thisValue) {
        var _this2 = this;

        if (thisValue == undefined) {
          thisValue = this;
        }

        var itemListCopy = [];
        var indexList = itemList.map(function (item) {
          itemListCopy.push(item);
          return _this2.indexOf(item);
        });
        itemListCopy.forEach(function (currentValue) {
          var currentIndex = _this2.indexOf(currentValue);

          operation.call(thisValue, currentValue, currentIndex, _this2);
        });
        return indexList;
      }
    },

    /**
     * safelyFilter(operation, thisValue)
     * 安全地操作并过滤所有元素；与 forEach 和 filter 的区别是： safelyFilter 能保证会遍历数组中所有已存在的元素，不会受 operation 中的行为的影响；
     * @param operation : (currentValue,currentIndex,currentArray)=>boolean | undefined     执行的操作， 该函数的返回值表示是否要过滤出该元素
     * @param thisValue ? : any   可选，默认值是被操作的数组，即调用者；操作 operation 的 this 值
     * @returns [Item]  返回被 operation 过滤出的元素
     *
     *
     * operation(currentValue,currentIndex,currentArray)=>boolean | undefined
     * @param currentValue : any   调用 operation 时的元素的值；
     * @param currentIndex : number     调用 operation 时 currentValue 对应的最新状态的索引值；
     * @param currentArray : Array   调用 operation 时 被操作时最新状态的数组；
     * @returns boolean | undefined  表示是否要过滤出 currentValue ；
     *
     */
    safelyFilter: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(operation, thisValue) {
        var _this3 = this;

        if (thisValue == undefined) {
          thisValue = this;
        }

        var arrayCopy = this.slice();
        return arrayCopy.filter(function (currentValue) {
          var currentIndex = _this3.indexOf(currentValue);

          operation.call(thisValue, currentValue, currentIndex, _this3);
        });
      }
    },
    //安全操作：结束
    //移动元素：开始

    /**
     * move(fromIndex, toIndex, length = 1)
     * 根据索引移动数组的元素
     * @param fromIndex : number   被移动的元素的开始索引
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param length ? : number   可选，默认值：1 ； 被移动的元素的长度；
     * @returns Array   被移动的元素的数组
     */
    move: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(fromIndex, toIndex) {
        var length = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var moveEleArr = this.splice(fromIndex, length);
        this.splice.apply(this, [toIndex, 0].concat(_toConsumableArray(moveEleArr)));
        return moveEleArr;
      }
    },

    /**
     * moveTo(toIndex, ...fromIndexs)
     * 根据索引批量移动数组的元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param fromIndex : number   被移动的元素的索引
     * @returns Array<Item>   被移动的元素的数组
     */
    moveTo: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(toIndex) {
        for (var _len = arguments.length, fromIndexs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          fromIndexs[_key - 1] = arguments[_key];
        }

        var moveItems = this.deleteIndexs.apply(this, fromIndexs);
        this.splice.apply(this, [toIndex, 0].concat(_toConsumableArray(moveItems)));
        return moveItems;
      }
    },

    /**
     * moveItemsTo(toIndex, ...items)
     * 批量移动数组的指定元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param item : any   被移动的元素
     * @returns Array<number>   被移动的元素的索引的数组
     */
    moveItemsTo: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(toIndex) {
        for (var _len2 = arguments.length, items = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          items[_key2 - 1] = arguments[_key2];
        }

        var indexArr = this.deleteItems.apply(this, items);
        this.splice.apply(this, [toIndex, 0].concat(items));
        return indexArr;
      }
    },

    /**
     * moveToUseTest(toIndex, needMoveTest)
     * 根据测试函数批量移动数组的元素
     * @param toIndex : number    元素被移动到的新位置的索引
     * @param needMoveTest : (currentValue,index,arr)=>boolean    测试数组元素是否需要被移动的函数，返回 boolean 值，表示当前元素 currentValue 是否需要被移动；
     * @returns Array<Item>   被移动的元素的数组
     */
    moveToUseTest: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(toIndex, needMoveTest, thisValue) {
        var moveItems = this.deleteUseTest(needMoveTest, thisValue);
        this.splice.apply(this, [toIndex, 0].concat(_toConsumableArray(moveItems)));
        return moveItems;
      }
    },
    //移动元素：结束
    //插入元素：开始

    /**
     * insertItem(item, toIndex = 0, equalTest)
     * 将指定元素插入到调用者数组中指定索引处，并且会删除调用者数组中与 item 相同的元素
     * @param item : any    被插入的元素
     * @param toIndex : number    元素被插入到的位置的索引
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array<Item>   被删除的元素
     */
    insertItem: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(item) {
        var _this4 = this;

        var toIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var equalTest = arguments.length > 2 ? arguments[2] : undefined;

        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        var deleItems = this.filter(function (currentValue, currentIndex, arr) {
          return equalTest.call(_this4, currentValue, item);
        });
        this.deleteItems.apply(this, _toConsumableArray(deleItems));
        this.splice(toIndex, 0, item);
        return deleItems;
      }
    },

    /**
     * insertItemList(itemList, toIndex = 0, equalTest)
     * 将指定数组itemList中的元素插入到调用者数组的指定索引处，并且会删除调用者数组中 与 itemList中元素 相同的元素
     * @param itemList : [any]    被插入的元素数组
     * @param toIndex ? : number    可靠；默认值：0 ； 元素被插入到的位置的索引；
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array<Item>   被删除的元素
     */
    insertItemList: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(itemList, toIndex, equalTest) {
        var _this5 = this;

        return itemList.reduceRight(function (deleItemList, item) {
          var deleItems = _this5.insertItem(item, toIndex, equalTest);

          deleItemList.unshift.apply(deleItemList, _toConsumableArray(deleItems));
          return deleItemList;
        }, []);
      }
    },
    //插入元素：结束
    //删除元素：开始

    /**
     * delete(start, end)
     * 根据索引删除数组的元素
     * @param start : number   被删除的元素的开始索引
     * @param end ? : number   可选，默认值：start ； 被删除的元素的结束索引；
     * @returns Array   被删除的元素的数组
     */
    "delete": {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(start, end) {
        if (end == null) {
          end = start;
        }

        var length = end + 1 - start;
        return this.splice(start, length);
      }
    },

    /**
     * deleteIndexs(...indexs)
     * 删除数组中指定的元素
     * @param index : number   被删除的元素的索引
     * @returns Array<Item>   被删除的元素的数组
     */
    deleteIndexs: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        for (var _len3 = arguments.length, indexs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          indexs[_key3] = arguments[_key3];
        }

        return this.safelyOperateIndexs(indexs, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);
      }
    },

    /**
     * deleteItems(...items)
     * 删除数组中指定的元素
     * @param item : any   被删除的元素
     * @returns Array<number>   被删除的元素的索引数组
     */
    deleteItems: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        for (var _len4 = arguments.length, items = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          items[_key4] = arguments[_key4];
        }

        return this.safelyOperateItems(items, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);
      }
    },

    /**
     * deleteUseTest(needDeleteTest)
     * 根据测试函数批量删除数组的元素
     * @param needDeleteTest : (currentValue,index,arr)=>boolean    测试数组元素是否需要被删除的函数，返回 boolean 值，表示当前元素 currentValue 是否需要被删除；
     * @returns Array<Item>   被删除的元素的数组
     */
    deleteUseTest: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(needDeleteTest, thisValue) {
        if (thisValue === undefined) {
          thisValue = this;
        }

        var itemList = this.filter(function (currentValue, currentIndex, arr) {
          return needDeleteTest.call(thisValue, currentValue, currentIndex, arr);
        });
        this.safelyOperateItems(itemList, function (currentValue, currentIndex, currentArray) {
          currentArray.splice(currentIndex, 1);
        }, this);
        return itemList;
      }
    },
    //删除元素：结束
    //查找元素：开始

    /**
     * filterIndexs(filterTest,thisArg)
     * 该方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素的索引。
     * @param filterTest : (currentValue,index,arr)=>boolean    用来测试数组的每个元素的函数。调用时使用参数 (currentValue,index,arr)。返回true表示保留该元素（通过测试），false则不保留
     * @param thisArg ? : any 可选。执行 callback 时的用于 this 的值。
     * @returns Array<Index>   通过测试的元素的索引
     */
    filterIndexs: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(filterTest, thisArg) {
        if (thisArg == undefined) {
          thisArg = this;
        }

        return this.reduce(function (indexList, currentValue, index, arr) {
          if (filterTest.call(thisArg, currentValue, index, arr)) {
            indexList.push(index);
          }

          return indexList;
        }, []);
      }
    },

    /**
     * 属性; 返回最后一个元素
     */
    lastItem: {
      configurable: true,
      enumerable: false,
      get: function get() {
        return this[this.length - 1];
      }
    },
    //查找元素：结束
    //集合运算：开始

    /**
     * isContains(arr,equalTest)
     * 判断当前数组 是否包含 数组arr 的所有元素；
     * @param arr : Array   被测试的数组
     * @param equalTest ? : (thisEle,arrEle)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素thisEle 和 元素arrEle  相同；
     * @returns boolean
     */
    isContains: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(arr, equalTest) {
        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        return arr.every(function (item) {
          return this.some(function (thisItem) {
            return equalTest.call(this, thisItem, item);
          }, this);
        }, this);
      }
    },

    /**
     * getIntersection(arr,equalTest)
     * 获取指定数组的交集
     * @param arr  : Array   数组
     * @param equalTest ? : (thisEle,arrEle)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素thisEle 和 元素arrEle  相同；
     * @returns Array   所有指定数组的交集
     */
    getIntersection: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(arr, equalTest) {
        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        return this.filter(function (thisEle) {
          return arr.some(function (arrEle) {
            return equalTest(thisEle, arrEle);
          });
        });
      }
    },

    /**
     * isIntersect(arr,equalTest)
     * 判断当前数组与指定数组是否相交
     * @param arr ? : Array   数组
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns boolean   当前数组与指定数组是否相交
     */
    isIntersect: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(arr, equalTest) {
        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        return this.some(function (thisEle) {
          return arr.some(function (arrEle) {
            return equalTest(thisEle, arrEle);
          });
        });
      }
    },

    /**
     * 获取当前数组在指定数组上的补集
     * @param universalArr ? : Array   全集数组
     * @param equalTest ? : (arrItem,thisItem)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array   当前数组在指定数组上的补集
     */
    getComplementOn: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(universalArr, equalTest) {
        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        return universalArr.filter(function (arrItem) {
          return !this.some(function (thisItem) {
            return equalTest.call(this, arrItem, thisItem);
          }, this);
        }, this);
      }
    },

    /**
     * 获取符合 包含 和 排除 项 的所有元素
     * getIncludeAndExclude(options,equalTest)
     * @param options : {include ?: Array,exclude ?: Array}    必须；配置 包含 和 排除 数组 的 选项；
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns Array   返回符合 options 中设置的 包含 和 排除 项 的所有元素
     */
    getIncludeAndExclude: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(options, equalTest) {
        var include = options.include,
            exclude = options.exclude;
        var valids = this;

        if (include) {
          valids = valids.getIntersection(include, equalTest);
        }

        if (exclude) {
          valids = exclude.getComplementOn(valids, equalTest);
        }

        return valids;
      }
    },
    //集合运算：结束
    //处理索引：开始

    /**
     * 获取指定索引的反相索引，即从后往前的索引，从0开始
     * @param index : number   正向的索引
     */
    reverseIndexForIndex: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(index) {
        return this.length - index - 1;
      }
    },
    //处理索引：结束
    //队列：开始

    /**
     * queuePush(item1, item2, ..., itemX)
     * 从队列尾部推入所有的item；此操作会从数组开始删除相应的数目的元素
     * @param item : any    推入队列的元素
     * @returns Array    返回包含所有删除元素的数组
     */
    queuePush: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        this.push.apply(this, arguments);
        return this.splice(0, arguments.length);
      }
    },

    /**
     * queuePop()
     * 从队列尾部推出（删除）一个item；此操作会将数组剩下的元素往数组尾部移动一位；
     * @returns any    返回被删除的元素
     */
    queuePop: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        this.unshift(undefined);
        return this.pop();
      }
    },

    /**
     * queueUnshift(item1, item2, ..., itemX)
     * 从队列头部推入所有的item；此操作会从数组尾部删除相应的数目的元素
     * @param item : any    推入队列的元素
     * @returns Array    返回包含所有删除元素的数组
     */
    queueUnshift: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        this.unshift.apply(this, arguments);
        var len = arguments.length;
        return this.splice(-len, len);
      }
    },

    /**
     * queueShift()
     * 从队列头部推出（删除）一个item；此操作会将数组剩下的元素往数组头部移动一位；
     * @returns any    返回被删除的元素
     */
    queueShift: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        this.push(undefined);
        return this.shift();
      }
    } //队列：结果

  };
  Object.defineProperties(Array.prototype, propertyDescriptors); //集合运算：开始

  /**
   * 获取所有指定数组的交集
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @param array ? : Array   数组
   * @returns Array   所有指定数组的交集
   */

  Array.intersectionOf = function intersectionOf(equalTest) {
    for (var _len5 = arguments.length, arrays = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      arrays[_key5 - 1] = arguments[_key5];
    }

    if (typeof equalTest != "function") {
      if (Array.isArray(equalTest)) {
        arrays.unshift(equalTest);
      }

      equalTest = function equalTest(a, b) {
        return a === b;
      };
    }

    arrays.sort(function (arr1, arr2) {
      return arr1.length - arr2.length;
    });
    var leastArr = arrays.shift();
    return leastArr.filter(function (item) {
      return arrays.every(function (arr) {
        return arr.some(function (arrItem) {
          return equalTest(item, arrItem);
        });
      });
    });
  };
  /**
   * 判断所有指定数组是否有交集
   * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
   * @param array ? : Array   数组
   * @returns boolean   所有指定数组是否有交集
   */


  Array.isIntersect = function isIntersect(equalTest) {
    for (var _len6 = arguments.length, arrays = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      arrays[_key6 - 1] = arguments[_key6];
    }

    if (typeof equalTest != "function") {
      if (Array.isArray(equalTest)) {
        arrays.unshift(equalTest);
      }

      equalTest = function equalTest(a, b) {
        return a === b;
      };
    }

    arrays.sort(function (arr1, arr2) {
      return arr1.length - arr2.length;
    });
    var leastArr = arrays.shift();
    return leastArr.some(function (item) {
      return arrays.every(function (arr) {
        return arr.some(function (arrItem) {
          return equalTest(item, arrItem);
        });
      });
    });
  }; //集合运算：结束

  /**
   * isArrayLike(target)
   * 判断 target 是否为 类数组对象
   * @param target : any    目标
   * @returns boolean
   */


  Array.isArrayLike = function isArrayLike(target) {
    var length = target && target.length;
    return Number.isInteger(target.length) && length >= 0;
  };

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  //对 JSON 扩展的属性和方法都写在 extendJSON 里面
  var extendJSON = {
    extended: true,
    //用于标识 JSON 是否这被对象 extendJSON 扩展过；

    /**
     * 安全地解析字符串，不会抛出错误，返回一个解析结果的信息对象
     * @param text : string   必需， 一个有效的 JSON 字符串。
     * @param reviver ?: function   可选，一个转换结果的函数， 将为对象的每个成员调用此函数。
     * @returns {parsed: boolean, result: string | JSONObject }   解析的结果； parsed ：表示是否成功解析； result ： 最终解析的结果，如果成功解析，则该值为解析后的JSON对象，如果未成功解析，则该值为原字符串 text
     */
    safelyParse: function safelyParse(text, reviver) {
      var parseInfo = {
        parsed: true,
        result: text
      };

      try {
        parseInfo.result = JSON.parse(text, reviver);
      } catch (e) {
        parseInfo.parsed = false;
      }

      return parseInfo;
    },

    /**
     * 将目标深度序列化成JSON字符串
     * @param target : any    将要序列化成 一个JSON 字符串的值。
     * @param replacer ? : (key,vlaue)=>vlaue |  Array    如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为null或者未提供，则对象所有的属性都会被序列化；关于该参数更详细的解释和示例，请参考使用原生的 JSON 对象一文。
     * @param space ?  指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串(字符串的前十个字母)，该字符串将被作为空格；如果该参数没有提供（或者为null）将没有空格。
     * @returns string   一个表示给定值的JSON字符串。
     *
     *
     *
     * 注意：
     * 该方法会把 target 的中的所有对象属性单独序列化成 JSON 字符串
     */
    depthStringify: function depthStringify(target, replacer, space) {
      var _this = this;

      var newTarget = Object.keys(target).reduce(function (total, key) {
        var prop = target[key];

        if (_typeof(prop) == "object") {
          prop = _this.depthStringify(prop, replacer, space);
        }

        total[key] = prop;
        return total;
      }, {});
      return JSON.stringify(newTarget, replacer, space);
    },

    /**
     * 深度解析； depthStringify 的逆运算
     * @param text
     * @param reviver
     * @returns any
     */
    depthParse: function depthParse(text, reviver) {
      var _this2 = this;

      var result = JSON.correctParse(text, reviver);

      if (_typeof(result) == "object") {
        Object.keys(result).forEach(function (key) {
          var prop = result[key];
          prop = _this2.depthParse(prop, reviver);
          result[key] = prop;
        });
      }

      return result;
    },

    /**
     * 判断 text 是否是有效的JSON字符串
     * @returns boolean
     */
    isJSONString: function isJSONString(text) {
      try {
        var parsed = JSON.parse(text);
        var isJSON = parsed !== text;
      } catch (e) {
        isJSON = false;
      }

      return isJSON;
    },

    /**
     * correctParse(text,reviver)
     * 正确地解析，即：如果 text 是有效的 JSON 字符串，则解析它并返回解析后的结果，否则，返回原来的text
     * @param text :  string   被解析的字符串
     * @returns any
     */
    correctParse: function correctParse(text, reviver) {
      try {
        var parsed = JSON.parse(text, reviver);
        var isJSON = parsed !== text;
      } catch (e) {
        isJSON = false;
      }

      if (!isJSON) {
        parsed = text;
      }

      return parsed;
    }
  };
  var oriJSON = globalThis.JSON;
  /*
  * 翻用这种方式的原因是：
  * 为了防止别人重置 JSON 对象时忽略了本文件扩展的方法；
  * */

  Object.defineProperty(globalThis, "JSON", {
    get: function get() {
      return globalThis._JSON;
    },
    set: function set(newValue) {
      if (!newValue.extended) {
        Object.assign(newValue, extendJSON);
      }

      globalThis._JSON = newValue;
    }
  });
  globalThis.JSON = oriJSON;

  Object.defineProperties(String.prototype, {
    /**
     * 是否是有效的 JSON 字符串
     */
    isJSONString: {
      configurable: true,
      get: function get() {
        return JSON.isJSONString(this);
      }
    },

    /**
     * 是否不包任何非空字符
     */
    noChars: {
      configurable: true,
      get: function get() {
        return !/\S+/.test(this);
      }
    },

    /**
     * 首字母大写
     */
    capFirstLetter: {
      configurable: true,
      get: function get() {
        return this.replace(/(^\W*)(\w)/, function (match, p1, p2) {
          return p1 + p2.toUpperCase();
        });
      }
    },

    /**
     * 把字符串转换成分隔线的格式
     * @param separator ? : string   可选，默认值："-" ；   分隔线
     * @property caseType ? : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常，不做改变；
     * @returns string
     */
    toSeparatorLineFormat: {
      configurable: true,
      writable: true,
      value: function value(separator, caseType) {
        if (separator == undefined) {
          separator = "-";
        }

        if (caseType == undefined) {
          caseType = "N";
        }

        var lowerCase = caseType == "L";
        var targetStr = this.replace(/[A-Z]+/g, function (match, offset, oriStr) {
          var matchStr = lowerCase ? match.toLowerCase() : match;
          return separator + matchStr;
        });
        var errorSeparatorRexStr = "(^\\s*)" + separator + "+";
        var errorSeparatorRex = new RegExp(errorSeparatorRexStr);
        targetStr = targetStr.replace(errorSeparatorRex, "$1"); //如果首字母是大写，执行replace时会多一个_，这里需要去掉

        if (caseType == "U") {
          targetStr = targetStr.capFirstLetter;
        }

        return targetStr;
      }
    },

    /**
     * 把字符串从分隔线格式转换成驼峰格式
     * @param separators ? : string | string[]   可选，默认值：['-', '_'] ；   分隔线，或 包含多个分隔线的数组
     * @returns string
     */
    toHumpFormat: {
      configurable: true,
      writable: true,
      value: function value(separators) {
        if (separators == undefined) {
          separators = ['-', '_'];
        } else if (!Array.isArray(separators)) {
          separators = [separators];
        }

        var separatorRexStr = '(' + separators.join('|') + ')' + '+([A-Za-z]?)';
        var separatorRex = new RegExp(separatorRexStr, 'g');
        return this.replace(separatorRex, function (match, p1, p2) {
          return p2.toUpperCase();
        });
      }
    },

    /**
     * 获取所有指定格式的字符串
     * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
     * FormatObject := {separator : string, caseType : L | U | N}
     * @property separator  : string     分隔符
     * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
     * @returns [string]  所有指定格式的字符串数组
     */
    getAllStrForFormats: {
      configurable: true,
      writable: true,
      value: function value(formats) {
        var _this = this;

        if (!Array.isArray(formats)) {
          formats = [formats];
        }

        var allStrs = formats.reduce(function (total, format) {
          var separator = format.separator;
          var caseType = format.caseType || "N";
          var targetStr = _this;

          if (separator != undefined) {
            targetStr = _this.toSeparatorLineFormat(separator, caseType);
          } else if (caseType == "U") {
            targetStr = _this.toUpperCase();
          } else if (caseType == "L") {
            targetStr = _this.toLowerCase();
          }

          total.push(targetStr);
          return total;
        }, []);
        return allStrs;
      }
    },
    //URL相关：开始

    /**
     * 是否是URL
     */
    isURL: {
      configurable: true,
      get: function get() {
        return /^\w+:\/\/\S+/.test(this);
      }
    } //URL相关：结束

  });

  /**
   * 接口1:
   * distanceSort(target, num1,num2 ,...)
   * 根据各个 num 在数轴上距 target 远近来排序
   * @param target : number  目标，参考数
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   *
   *
   * 接口2:
   * distanceSort(target, nums)
   * 根据 nums 各个数在数轴上距 target 远近来排序
   * @param target : number  目标，参考数
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   */
  Math.distanceSort = function distanceSort(target) {
    for (var _len = arguments.length, nums = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      nums[_key - 1] = arguments[_key];
    }

    var numList = nums;
    var firstNum = nums[0];

    if (nums.length == 1 && Array.isArray(firstNum)) {
      numList = firstNum.slice();
    }

    var disSort = numList.sort(function (a, b) {
      return Math.abs(a - target) - Math.abs(b - target);
    });
    return disSort;
  };
  /**
   * 接口1:
   * nearest(target, num1,num2 ,...)
   * 返回距 target 最近的数
   * @param target : number  目标，参考数
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   *
   *
   * 接口2:
   * nearest(target, nums)
   * 返回距 target 最近的数
   * @param target : number  目标，参考数
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   */


  Math.nearest = function nearest(target) {
    for (var _len2 = arguments.length, nums = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      nums[_key2 - 1] = arguments[_key2];
    }

    var disSort = Math.distanceSort.apply(Math, [target].concat(nums));
    return disSort[0];
  };
  /**
   * 接口1:
   * farthest(target, num1,num2 ,...)
   * 返回距 target 最远的数
   * @param target : number  目标，参考数
   * @param num : number    参与比较的数
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   *
   *
   * 接口2:
   * farthest(target, nums)
   * 返回距 target 最远的数
   * @param target : number  目标，参考数
   * @param nums : [number]    参考比较的数的数组
   * @returns [number]   返回 按距离 target 从近到远排列的数的数组
   */


  Math.farthest = function farthest(target) {
    for (var _len3 = arguments.length, nums = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      nums[_key3 - 1] = arguments[_key3];
    }

    var disSort = Math.distanceSort.apply(Math, [target].concat(nums));
    var lastIndex = disSort.length - 1;
    return disSort[lastIndex];
  };

  var propertyDescriptors$1 = {
    /**
     * 接口1:
     * distanceSort(num1,num2 ,...)
     * 根据各个 num 在数轴上距 自己 远近来排序
     * @param num : number    参与比较的数
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     *
     *
     * 接口2:
     * distanceSort(nums)
     * 根据 nums 各个数在数轴上距 自己 远近来排序
     * @param nums : [number]    参考比较的数的数组
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     */
    distanceSort: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        for (var _len = arguments.length, nums = new Array(_len), _key = 0; _key < _len; _key++) {
          nums[_key] = arguments[_key];
        }

        return Math.distanceSort.apply(Math, [this].concat(nums));
      }
    },

    /**
     * 接口1:
     * nearest(num1,num2 ,...)
     * 返回距 自己 最近的数
     * @param num : number    参与比较的数
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     *
     *
     * 接口2:
     * nearest(nums)
     * 返回距 自己 最近的数
     * @param nums : [number]    参考比较的数的数组
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     */
    nearest: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        for (var _len2 = arguments.length, nums = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nums[_key2] = arguments[_key2];
        }

        return Math.nearest.apply(Math, [this].concat(nums));
      }
    },

    /**
     * 接口1:
     * farthest(num1,num2 ,...)
     * 返回距 自己 最远的数
     * @param num : number    参与比较的数
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     *
     *
     * 接口2:
     * farthest(nums)
     * 返回距 自己 最远的数
     * @param nums : [number]    参考比较的数的数组
     * @returns [number]   返回 按距离 自己 从近到远排列的数的数组
     */
    farthest: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value() {
        for (var _len3 = arguments.length, nums = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          nums[_key3] = arguments[_key3];
        }

        return Math.farthest.apply(Math, [this].concat(nums));
      }
    }
  };
  Object.defineProperties(Number.prototype, propertyDescriptors$1); //兼容：开始

  if (!Number.isInteger) {
    Number.isInteger = Number.isInteger || function (value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
  } //兼容：结束

  /**
   *
   * 接口1
   * getDaysOfMonth(timestamp)
   * 获取指定时间所在月份的总天数
   * @param timestamp : number  代表自1970年1月1日00:00:00 (世界标准时间) 起经过的毫秒数。
   * @returns number   返回指定月份的天数
   *
   *
   *
   * 接口2
   * getDaysOfMonth(dateString)
   * 获取指定时间所在月份的总天数
   * @param dateString : string  日期的字符串值。该字符串应该能被 Date.parse() 方法识别
   * @returns number   返回指定月份的天数
   *
   *
   *
   * 接口3
   * getDaysOfMonth(date)
   * 获取指定时间实例所在月份的总天数
   * @param date : Date  Date 实例。
   * @returns number   返回指定月份的天数
   *
   *
   * 接口4
   * getDaysOfMonth(year, month)
   * 获取指定月份的总开数
   * @param year : number  年份
   * @param month : number  月份
   * @returns number   返回指定月份的天数
   *
   *
   * 接口5
   * getDaysOfMonth()
   * 获取当前时间实例所在月份的总天数
   * @returns number   返回当前时间所在月份的总天数
   */
  Date.getDayNumberOfMonth = function getDayNumberOfMonth(year, month) {
    switch (arguments.length) {
      case 2:
        {
          var date = new Date(year, month);
          break;
        }

      case 1:
        {
          var initValue = year;

          if (year instanceof Date) {
            initValue = year.getTime();
          }

          date = new Date(initValue);
          break;
        }

      default:
        {
          date = new Date();
        }
    }

    date.setMonthOffset(1);
    date.setDate(0);
    var dayNum = date.getDate();
    return dayNum;
  };
  /**
   * 获取该日期所在月份的天数
   */


  Date.prototype.getDayNumber = function getDayNumber() {
    return Date.getDayNumberOfMonth(this);
  };
  /**
   * setYearOffset(offset)
   * 设置年份偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的年份
   */


  Date.prototype.setYearOffset = function setYearOffset(offset) {
    if (offset) {
      var num = this.getFullYear();
      this.setFullYear(num + offset);
    }

    return this.getFullYear();
  };
  /**
   * setMonthOffset(offset)
   * 设置月份偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的月份
   */


  Date.prototype.setMonthOffset = function setMonthOffset(offset) {
    if (offset) {
      var num = this.getMonth();
      this.setMonth(num + offset);
    }

    return this.getMonth();
  };
  /**
   * setDateOffset(offset)
   * 设置天偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的天
   */


  Date.prototype.setDateOffset = function setDateOffset(offset) {
    if (offset) {
      var num = this.getDate();
      this.setDate(num + offset);
    }

    return this.getDate();
  };
  /**
   * setHourOffset(offset)
   * 设置小时偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns date : number   偏移后的小时
   */


  Date.prototype.setHourOffset = function setHourOffset(offset) {
    if (offset) {
      var num = this.getHours();
      this.setHours(num + offset);
    }

    return this.getHours();
  };
  /**
   * setMinuteOffset(offset)
   * 设置分钟偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的分钟
   */


  Date.prototype.setMinuteOffset = function setMinuteOffset(offset) {
    if (offset) {
      var num = this.getMinutes();
      this.setMinutes(num + offset);
    }

    return this.getMinutes();
  };
  /**
   * setSecondOffset(offset)
   * 设置秒数偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的秒数
   */


  Date.prototype.setSecondOffset = function setSecondOffset(offset) {
    if (offset) {
      var num = this.getSeconds();
      this.setMinutes(num + offset);
    }

    return this.getSeconds();
  };
  /**
   * setMillisecondOffset(offset)
   * 设置亳秒数偏移量 正数：向未来偏移，负数，表示向过去偏移
   * @param offset : number   偏移量，正数：向未来偏移，负数，表示向过去偏移
   * @returns number   偏移后的亳秒数
   */


  Date.prototype.setMillisecondOffset = function setMillisecondOffset(offset) {
    if (offset) {
      var num = this.getMilliseconds();
      this.setMilliseconds(num + offset);
    }

    return this.getMilliseconds();
  }; //获取从开始到结束的步长为step的所有时间

  /*Date.getAllDate  = function(start,step,end) {

    switch (step) {
      case

    }


  };*/

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  /*
   使用属性描述来定义属性的原因：
   - 为了不让 for...in 等类似的操作遍历这些定义在原型上的方法或属性，需要将属性设置为不可枚举的；
   - 为了解决给 Object.prototype 添加属性会在Vue中报错的问题，需要将属性设置为不可枚举的；


   注意：
   - Object.prototype 和  Object 上不能定义同名成员；
   */

  var propertyDescriptors$2 = {
    /**
     * 找出对象中符合测试函数的属性名
     * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
     */
    findKey: {
      configurable: true,
      writable: true,
      //为了兼容 lodash 库，因为 rollup-plugin-typescript2 所依赖的 lodash 库会更改该属性 findKey
      enumerable: false,
      value: function value(testFun) {
        var _this2 = this;

        return Object.keys(this).find(function (key, index) {
          var propValue = _this2[key];
          return testFun(propValue, key, index);
        });
      }
    },

    /**
     * 找出对象中符合测试函数的属性信息
     * @param testFun:(propValue,propkey,index)=> boolean  ; 测试条件函数
     * @return PropertyInfo : {key:string,value:any}
     */
    findProperty: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(testFun) {
        var prop = Object.entries(this).find(function (entry, index) {
          return testFun(entry[1], entry[0], index);
        });
        var propInfo = {
          key: null,
          value: null
        };

        if (prop) {
          propInfo.key = prop[0];
          propInfo.value = prop[1];
        }

        return propInfo;
      }
    },

    /**
     * 检验该对象自身是否是扁平的，即：该对象的所有的直接属性的属性值都是非对象类型；
     */
    isFlat: {
      configurable: true,
      enumerable: false,
      get: function get() {
        var noFlat = Object.values(this).some(function (propValue) {
          var propType = _typeof(propValue);

          return propValue && (propType === "object" || propType === "function");
        });
        return !noFlat;
      }
    },

    /**
     * 返回对象是否是空的对象，即没有自己的可枚举的属性
     */
    noKeys: {
      configurable: true,
      enumerable: false,
      get: function get() {
        return Object.keys(this).length == 0;
      }
    },

    /**
     * 获取对象中拥有的 相应key的值；
     * @param keys:[string]  指定的key的数组
     * @return [any]    对象中拥有的相应key的值
     */
    getValuesOfKeys: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(keys) {
        var _this = this;

        return keys.reduce(function (total, currentKey) {
          if (currentKey in _this) {
            total.push(_this[currentKey]);
          }

          return total;
        }, []);
      }
    },

    /**
     * 获取对象中拥有的 相应key的 有效值；
     * 注意：不包含值为 undefined 或 null 的值
     * @param keys:[string]  指定的key的数组
     * @return [any]    对象中拥有的相应key的有效值
     *
     */
    getVirtualValuesOfKeys: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(keys) {
        var _this = this;

        return keys.reduce(function (total, currentKey) {
          var currValue = _this[currentKey];

          if (currValue != undefined) {
            total.push(currValue);
          }

          return total;
        }, []);
      }
    },

    /**
     * 查找对象中所有指定的属性中的第一个有效值
     * @param keys : [string]   被查找的属性列表
     * @returns any  对象中所有指定的属性中的第一个有效值
     */
    findValueOfKeys: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(keys) {
        var findValue;
        keys.find(function (currentKey) {
          var currValue = this[currentKey];
          var valid = currValue != undefined;

          if (valid) {
            findValue = currValue;
          }

          return valid;
        }, this);
        return findValue;
      }
    },

    /**
     * 获取对象中所有指定格式的属性的值列表
     * @param key : string   基本的属性字符串
     * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
     * FormatObject := {separator : string, caseType : L | U | N}
     * @property separator  : string     分隔符
     * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
     * @returns [any]  对象中所有指定格式的属性的值列表
     */
    getValuesForKeyFormats: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(key, formats) {
        var keyStrList = key.getAllStrForFormats(formats);
        return this.getValuesOfKeys(keyStrList);
      }
    },

    /**
     * 获取对象中所有指定格式的属性的有效值列表
     * @param key : string   基本的属性字符串
     * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
     * FormatObject := {separator : string, caseType : L | U | N}
     * @property separator  : string     分隔符
     * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
     * @returns [any]  对象中所有指定格式的属性的值列表
     */
    getVirtualValuesForKeyFormats: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(key, formats) {
        var keyStrList = key.getAllStrForFormats(formats);
        return this.getVirtualValuesOfKeys(keyStrList);
      }
    },

    /**
     * 查找对象中所有指定格式的属性的第一个有效值
     * @param key : string   基本的属性字符串
     * @param formats : [FormatObject]  | FormatObject   格式对象 或者 数组
     * FormatObject := {separator : string, caseType : L | U | N}
     * @property separator  : string     分隔符
     * @property caseType  : L | U | N     大小写类型；   L : 小写，当没有设置 separator 时，将会把所有字符都转为小写 ； U : 大写 ，当没有设置 separator 时，将会把所有字符都转为大写； N : 正常
     * @returns any  对象中所有指定格式的属性的第一个有效值
     */
    findValueForKeyFormats: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(key, formats) {
        var keyStrList = key.getAllStrForFormats(formats);
        return this.findValueOfKeys(keyStrList);
      }
    },
    //集合：开始

    /**
     * 判断当前对象是否是指定对象的子集；即当前对象自己的所有可枚举属性 及 值 是否都包含于 指定的对象上；
     * @param universalObj : Object   全集对象
     * @param equalTest ? : (a,b)=>boolean    可选， 默认是通过全等 === 来判断元素是否相等的；测试数组元素是否相同的函数，返回 boolean 值，表示 元素a 和 元素b  相同；
     * @returns boolean   当前对象是否是指定对象的子集
     */
    isSubsetOf: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(universalObj, equalTest) {
        if (!equalTest) {
          equalTest = function equalTest(a, b) {
            return a === b;
          };
        }

        var thisEntries = Object.entries(this);
        return thisEntries.every(function (entrie, index) {
          var key = entrie[0];
          var value = entrie[1];
          return equalTest.call(this, value, universalObj[key]);
        }, this);
      }
    },
    //集合：结束

    /**
     * depthLoopOwnProperty(callback,depth,all,thisValue,initDepth)=> stopInfo
     * 递归遍历自身属性链中的所有属性
     * @param callback : (key,value,obj,currDepth))=> stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 initDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 depthLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
     * @param depth ? : number    可选；默认值：-1 ,即无限深度； 要循环遍历的深度；
     * @param all ? : boolean    可选；默认值: false ;  是否遍历自身所有的属性，包括不可枚举的；
     * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
     * @param initDepth ? : number   可选；默认值：1；深度的初始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
     * @returns stopInfo ： any   终止循环时返回的信息；
     */
    depthLoopOwnProperty: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(callback, depth, all, thisValue, initDepth) {
        if (depth == undefined) {
          depth = -1;
        }

        if (depth == 0) {
          return;
        }

        if (initDepth == undefined) {
          initDepth = 1;
        }

        if (thisValue === undefined) {
          thisValue = this;
        }

        if (all) {
          var keyList = Object.getOwnPropertyNames(this);
        } else {
          keyList = Object.keys(this);
        } //中止遍历


        var stopInfo;

        var _iterator = _createForOfIteratorHelper(keyList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            var value = this[key];

            if (_typeof(value) == "object") {
              stopInfo = value.depthLoopOwnProperty(callback, depth - 1, all, thisValue, initDepth + 1);

              if (stopInfo) {
                break;
              }
            }

            stopInfo = callback.call(thisValue, key, value, this, initDepth);

            if (stopInfo) {
              break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return stopInfo;
      }
    },

    /**
     * depthLoopPropertyWithPrototype(callback,depth,thisValue,initDepth)=> stopInfo
     * 递归遍历自身包括原型的属性链中的所有可枚举的属性
     * @param callback : (key,value,obj,currDepth))=>stopInfo : any    必选； 循环遍历的回调函数； key : 当前被遍历的属性名；value : 当前被遍历的属性值；obj : 当前被遍历的属性所属的对象；currDepth : 当前遍历的深度值，从 initDepth 所表示的值开始计数；返回值 stopInfo : 表示是否中止循环，并且该值会被 depthLoopOwnProperty 函数返回，如果返回的值是真值，则终止循环；
     * @param depth ? : number    可选；默认值：-1 ,即无限深度； 要循环遍历的深度；
     * @param thisValue ? : any    可选；   callback 回调函数的this值 ；默认值：当前被遍历的属性所属的对象；
     * @param initDepth ? : number   可选；默认值：1；深度的初始值； 注意：设计该属性的主要目的是为了递归调用时记录当前传递当前的深度值的；
     * @returns stopInfo ： any   终止循环时返回的信息；
     */
    depthLoopPropertyWithPrototype: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(callback, depth, thisValue, initDepth) {
        if (depth == undefined) {
          depth = -1;
        }

        if (depth == 0) {
          return;
        }

        if (initDepth == undefined) {
          initDepth = 1;
        }

        if (thisValue === undefined) {
          thisValue = this;
        } //中止遍历


        var stopInfo;

        for (var key in this) {
          var value = this[key];

          if (_typeof(value) == "object") {
            stopInfo = value.depthLoopPropertyWithPrototype(callback, depth - 1, thisValue, initDepth + 1);

            if (stopInfo) {
              break;
            }
          }

          stopInfo = callback.call(thisValue, key, value, this, initDepth);

          if (stopInfo) {
            break;
          }
        }

        return stopInfo;
      }
    },

    /**
     * filterProperty(filter,thisValue)
     * 返回包含符合条件的所有属性的新对象
     * @param filter : (key,value,obj)=>boolean    必选；
     * @param thisValue ? : any   可选；默认值：当前对象； filter 函数的this 值；
     * @returns Object   返回包含符合条件的所有属性的新对象
     */
    filterProperty: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(filter, thisValue) {
        var _this3 = this;

        if (arguments.length < 2) {
          thisValue = this;
        }

        return Object.entries(this).reduce(function (preValue, entr) {
          var key = entr[0];
          var value = entr[1];

          if (filter.call(thisValue, key, value, _this3)) {
            preValue[key] = value;
          }

          return preValue;
        }, {});
      }
    }
  };
  Object.defineProperties(Object.prototype, propertyDescriptors$2);
  /**
   * 用于将所有指定的属性的值从源对象复制到目标对象。它将返回目标对象。
   * @param target : Object     目标对象。
   * @param keys : Array<String>   需要复制的属性名数组
   * @param ...sources : Object    源对象参数序列
   * @return target    返回目标对象
   */

  Object.assignKeys = function (target, keys) {
    if (keys) {
      for (var _len = arguments.length, sources = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        sources[_key - 2] = arguments[_key];
      }

      var keysSourceList = sources.map(function (source) {
        return keys.reduce(function (newSource, aKey) {
          var aValue = source[aKey];

          if (aValue !== undefined) {
            newSource[aKey] = aValue;
          }

          return newSource;
        }, {});
      });
      Object.assign.apply(Object, [target].concat(_toConsumableArray(keysSourceList)));
    }

    return target;
  };
  /**
   * 用于将所有指定的属性之外的所有属性和值从源对象复制到目标对象。它将返回目标对象。
   * @param target : Object     目标对象。
   * @param keys : Array<String>   需要排除的属性名数组
   * @param ...sources : Object    源对象参数序列
   * @return target    返回目标对象
   */


  Object.assignExcludeKeys = function (target, keys) {
    if (keys) {
      for (var _len2 = arguments.length, sources = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        sources[_key2 - 2] = arguments[_key2];
      }

      var keysSourceList = sources.map(function (source) {
        var allKeys = Object.keys(source);
        var validKeys = keys.getComplementOn(allKeys);
        return validKeys.reduce(function (newSource, aKey) {
          var aValue = source[aKey];

          if (aValue !== undefined) {
            newSource[aKey] = aValue;
          }

          return newSource;
        }, {});
      });
      Object.assign.apply(Object, [target].concat(_toConsumableArray(keysSourceList)));
    }

    return target;
  };
  /**
   * 用于将所有符合 options 配置 的属性和值从源对象复制到目标对象。它将返回目标对象。
   * @param target : Object     目标对象。
   * @param options : IncludeAndExcludeKeysOptions  必须；配置 包含 和 排除 的 key 的 数组 的 选项；
   * @param ...sources : Object    源对象参数序列
   * @return target    返回目标对象
   *
   * IncludeAndExcludeKeysOptions = {include ?: Array,exclude ?: Array}
   */


  Object.assignIncludeAndExcludeKeys = function (target, options) {
    if (options && !options.noKeys) {
      for (var _len3 = arguments.length, sources = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        sources[_key3 - 2] = arguments[_key3];
      }

      var keysSourceList = sources.map(function (source) {
        var allKeys = Object.keys(source);
        var validKeys = allKeys.getIncludeAndExclude(options);
        return validKeys.reduce(function (newSource, aKey) {
          var aValue = source[aKey];

          if (aValue !== undefined) {
            newSource[aKey] = aValue;
          }

          return newSource;
        }, {});
      });
      Object.assign.apply(Object, [target].concat(_toConsumableArray(keysSourceList)));
    }

    return target;
  }; //兼容：开始
  //Object.entries(obj)


  if (!Object.entries) {
    Object.entries = function (obj) {
      var ownProps = Object.keys(obj),
          i = ownProps.length,
          resArray = new Array(i);

      while (i--) {
        var key = ownProps[i];
        resArray[i] = [key, obj[key]];
      }

      return resArray;
    };
  } //Object.fromEntries(entries)


  if (!Object.fromEntries) {
    Object.fromEntries = function (entries) {
      return entries.reduce(function (obj, entry) {
        obj[entry[0]] = entry[1];
        return obj;
      }, {});
    };
  } //兼容：结束

  /**
   * 定义代理属性； 给 对象 proxy 增加 能够代理 target 对象 的 属性 prop；
   * 当在 访问或配置 proxy 对象上的 prop 属性时，会将操作转发到 target 对象的 prop 属性；
   *
   * @param proxy : Object   必选；会在该对象上添加代理属性 prop
   * @param target : Object   必选；被代理的对象
   * @param prop : Property   必选；代理属性的名字；
   * @param options ?: ProxyOptions  代理属性的配置选项
   *
   * ProxyOptions = {get:boolean,set:boolean,configurable:boolean,enumerable:boolean,getDefault,setDefault}
   * get:boolean  可选；默认值：true； 表示是否要定义 get 的代理；
   * set:boolean  可选；默认值：true； 表示是否要定义 set 的代理；
   * configurable:boolean  可选；默认值：true； 表示该属性描述符的类型是否可以被改变并且该属性可以从对应对象中删除。
   * enumerable:boolean  可选；默认值：true； 表示当在枚举相应对象上的属性时该属性是否显现。
   * getDefault:any  可选；当 target 的属性 prop 为 undefined 时，proxy 会返回默认值 getDefault
   * setDefault:any  可选；当给代理对象 proxy 的 prop 属性 设置的 新值是 undefined 时，会将默认值 setDefault 设置 到 target 对象的 prop 属性上；
   *
   * @returns proxy : Object  传递给函数的 代理对象 proxy
   */


  Object.defineProxyProperty = function (proxy, target, prop, options) {
    var _ref = options || {},
        _ref$get = _ref.get,
        get = _ref$get === void 0 ? true : _ref$get,
        _ref$set = _ref.set,
        set = _ref$set === void 0 ? true : _ref$set,
        _ref$configurable = _ref.configurable,
        configurable = _ref$configurable === void 0 ? true : _ref$configurable,
        _ref$enumerable = _ref.enumerable,
        enumerable = _ref$enumerable === void 0 ? true : _ref$enumerable,
        getDefault = _ref.getDefault,
        setDefault = _ref.setDefault;

    var descriptor = {
      configurable: configurable,
      enumerable: enumerable
    };

    if (get) {
      descriptor.get = function () {
        var propValue = target[prop];
        return propValue === undefined ? getDefault : propValue;
      };
    }

    if (set) {
      descriptor.set = function (newValue) {
        newValue = newValue === undefined ? setDefault : newValue;
        target[prop] = newValue;
      };
    }

    Object.defineProperty(proxy, prop, descriptor);
    return proxy;
  };
  /**
   * 批量定义代理属性
   *
   * 接口1：defineProxyProperties(proxy,target,propOptions)
   * @param proxy : Object   必选；会在该对象上添加代理属性 prop
   * @param target : Object   必选；被代理的对象
   * @param propOptions : {propName:ProxyOptions}   必选；要定义的代理属性的配置对象；以该配置对象的属性名为 要配置的属性的名字，以其值为 本配置的属性的 配置选项
   * @returns proxy : Object  传递给函数的 代理对象 proxy
   *
   *
   * 接口2：defineProxyProperties(proxy,target,propArray,options)
   * @param proxy : Object   必选；会在该对象上添加代理属性 prop
   * @param target : Object   必选；被代理的对象
   * @param propArray : [string]   必选；要定义的代理属性的名字的列表。
   * @param options ?: ProxyOptions     可选；所有代理属性的配置选项
   *
   *  @returns proxy : Object  传递给函数的 代理对象 proxy
   */


  Object.defineProxyProperties = function (proxy, target, props, options) {
    var propsObj = props;

    if (Array.isArray(props)) {
      propsObj = props.reduce(function (total, propName) {
        total[propName] = options;
        return total;
      }, {});
    }

    Object.keys(propsObj).forEach(function (propName) {
      var propOpts = propsObj[propName];
      Object.defineProxyProperty(proxy, target, propName, propOpts);
    });
    return proxy;
  };
  /**
   * 判断 目标 是否是可迭代的对象，即 实现了 可迭代协议
   * @param target : any
   * @return {boolean}
   */


  Object.isIterable = function (target) {
    return target && typeof target[Symbol.iterator] === "function";
  };
  /**
   * 判断 目标 是否是迭代器，即 实现了 迭代器协议
   * @param target : any
   * @return {boolean}
   */


  Object.isIterator = function (target) {
    return target && typeof target.next === "function";
  };
  /**
   * isDepthEqual(a, b, nullNotEqualUndefined)
   * 深度测试  a 和 b 是否完全相等；如果 a 和 b 是 对象，会进行递归相等测试，只有所有的属性 都相等时，才会认为是相等的；
   *
   * 注意：
   * - 对于 值为 undefined 的属性 和 不存在的属性 认为是相等的属性；
   * - 对于 对于 函数 ，如果整个函数的代码字符（fun.toString()）串相等，则认为函数是相等的；
   * - 目前只判断了 基础类型、Object、Array、function、Date、可迭代 类型；
   * - 对于可迭代类型，必须迭代 索引 和 索引对应的值 都相等才认为是相等的；
   *
   * @param a : any
   * @param b : any
   * @param nullNotEqualUndefined ? : boolean    可选；默认值：false;  是否把 null 和 undefined 作为不等的值来对待
   * @param strict ? : boolean    可选；默认值：false;  是否使用严格相等来对 基本类型的值 进行比较
   * @return boolean
   */


  Object.isDepthEqual = function isDepthEqual(a, b, nullNotEqualUndefined, strict) {
    if (strict) {
      if (nullNotEqualUndefined) {
        var equalTest = function equalTest(a, b) {
          return a === b;
        };
      } else {
        equalTest = function equalTest(a, b) {
          return a === b || a == null && b == null;
        };
      }
    } else {
      if (nullNotEqualUndefined) {
        equalTest = function equalTest(a, b) {
          return a == null ? a === b : a == b;
        };
      } else {
        equalTest = function equalTest(a, b) {
          return a == b;
        };
      }
    }

    if (equalTest(a, b) || Object.is(a, b)) {
      return true;
    } else if (a == null || b == null) {
      return equalTest(a, b);
    }

    var aType = _typeof(a);

    var bType = _typeof(b);

    if (aType != bType) {
      //测试 基础类型 与 其包装类型 的相等性
      return equalTest(a.valueOf ? a.valueOf() : a, b.valueOf ? b.valueOf() : b);
    }

    if (aType == "function") {
      return equalTest(a, b) || equalTest(a.toString(), b.toString());
    }

    if (aType == "object") {
      if (a instanceof Date) {
        return equalTest(a.valueOf(), b.valueOf());
      }

      if (a instanceof Map) {
        if (b instanceof Map && a.size === b.size) {
          var _iterator2 = _createForOfIteratorHelper(a),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _step2$value = _slicedToArray(_step2.value, 2),
                  key = _step2$value[0],
                  aVal = _step2$value[1];

              if (!(b.has(key) && Object.isDepthEqual(aVal, b.get(key), nullNotEqualUndefined, strict))) {
                return false;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return true;
        }

        return false;
      }

      var aIsArr = Array.isArray(a);
      var bIsArr = Array.isArray(b);

      if (!aIsArr && Object.isIterable(a)) {
        var aArr = [];

        var _iterator3 = _createForOfIteratorHelper(a),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var value = _step3.value;
            aArr.push(value);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        a = aArr;
        aIsArr = true;
      }

      if (!bIsArr && Object.isIterable(b)) {
        var bArr = [];

        var _iterator4 = _createForOfIteratorHelper(b),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _value = _step4.value;
            bArr.push(_value);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        b = bArr;
        bIsArr = true;
      }

      if (aIsArr != bIsArr) {
        return false;
      }

      if (aIsArr) {
        if (a.length != b.length) {
          return false;
        }

        return a.every(function (aValue, index) {
          var bValue = b[index];
          return Object.isDepthEqual(aValue, bValue, nullNotEqualUndefined, strict);
        });
      }

      var aEntrs = Object.entries(a);
      var bEntrs = Object.entries(b);
      aEntrs = aEntrs.filter(function (entr) {
        return !equalTest(entr[1], undefined);
      });
      bEntrs = bEntrs.filter(function (entr) {
        return !equalTest(entr[1], undefined);
      });

      if (aEntrs.length != bEntrs.length) {
        return false;
      }

      return aEntrs.every(function (aEntr) {
        var key = aEntr[0];
        var aValue = aEntr[1];
        var bValue = b[key];
        return Object.isDepthEqual(aValue, bValue, nullNotEqualUndefined, strict);
      });
    }

    return equalTest(a, b);
  };

  function _typeof$1(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof$1 = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof$1 = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof$1(obj);
  }
  // 普通解析与字符串化：开始
  //不依赖 URL 和 URLSearchParams 的解析：开始

  /**
   *默认的 paramsPropParse ; 用JSON解析参数的属性
   */

  function _paramsPropJSONParse(value) {
    return JSON.correctParse(value);
  }
  /**
   *默认的 paramsPropStringify ；用JSON序列化参数的属性
   */


  function _paramsPropJSONStringify(value, key, params) {
    if (_typeof$1(value) == "object") {
      value = JSON.stringify(value);
    }

    return value;
  }

  /**
   * 把对象 obj 用JSON的方式格式化成 URL 的参数格式；
   * @param obj : Object   必选；被格式化的对象
   * @param queryPrefix ? : boolean    可选；默认值：false; 是否带URL的查询字符串前缀 ?
   * @returns 格式化后的 URL 的参数格式
   *
   *
   * 说明
   * 当URL参数对象 obj 不只有一层属性（如果obj的属性也是对象）时，URL的查询字符串就很很表示了；本方法就是用来解决这个问题；
   * 被本方法格式化的URL查询字符串，需要用 JSON 的 parseQueryString 方法来解析成对象；
   *
   */

  function JSONQueryStringify(obj, queryPrefix) {
    return queryStringify(obj, queryPrefix, _paramsPropJSONStringify);
  }
  /**
   * 把 通过 JSONQueryStringify 格式化后的查询字符串 queryString 解析成 对象；
   * @param queryString : string   必选；被格式化的对象
   * @returns 解析后的对象
   *
   */

  function parseJSONQueryString(queryString) {
    return parseQueryString(queryString, _paramsPropJSONParse);
  }
  //查询字符串：开始

  /**
   * 接口1
   * queryStringify(params,queryPrefix,paramsPropStringify)
   * @param params : Object    被序列化的参数对象
   * @param queryPrefix ? : boolean   可选；默认值：false ; 是否带有 ？ 前缀
   * @param paramsPropStringify ? : (value,key,params)=> string    可选； 对 value 进行转换的函数；
   * @returns string   序列化后的url查询字符串
   *
   *
   *
   *
   * 接口2:
   * queryStringify(params,paramsPropStringify)
   * @param params : Object    被序列化的参数对象
   * @param paramsPropStringify ? : (value,key,params)=> string    可选； 对 value 进行转换的函数；
   * @returns string   序列化后的url查询字符串
   */

  function queryStringify(params, queryPrefix, paramsPropStringify) {
    if (arguments.length == 2 && typeof queryPrefix == "function") {
      paramsPropStringify = queryPrefix;
      queryPrefix = undefined;
    }

    if (!paramsPropStringify) {
      paramsPropStringify = function paramsPropStringify(value) {
        return value;
      };
    }

    var paramList = Object.entries(params).map(function (kvArr, index, array) {
      var key = kvArr[0];
      var keyStr = encodeURIComponent(key);
      var value = kvArr[1];
      value = paramsPropStringify.call(params, value, key, params);
      var valueStr = encodeURIComponent(value);
      return keyStr + "=" + valueStr;
    });
    var queryString = paramList.join("&");

    if (queryPrefix) {
      queryString = "?" + queryString;
    }

    return queryString;
  }
  /**
   * parseQueryString(queryString,paramsPropParse)
   * @param queryString : string    被解析的查询字符串；
   * @param paramsPropParse ? : (value,key,queryString)=> value    可选；对 value 进行转换
   * @returns Object   解析后的对象
   */

  function parseQueryString(queryString, paramsPropParse) {
    if (!paramsPropParse) {
      paramsPropParse = function paramsPropParse(value) {
        return value;
      };
    }

    var preIndex = queryString.indexOf("?");
    var anrIndex = queryString.indexOf("#");

    if (anrIndex == -1) {
      anrIndex = undefined;
    }

    queryString = queryString.substring(preIndex + 1, anrIndex);
    queryString = queryString.replace(/^\?/, "");
    var kvStrList = queryString.split("&");
    return kvStrList.reduce(function (obj, kvStr) {
      var kvList = kvStr.split("=");
      var key = decodeURIComponent(kvList[0]);
      var value = decodeURIComponent(kvList[1]);
      value = paramsPropParse(value, key, queryString);
      obj[key] = value;
      return obj;
    }, {});
  } //查询字符串：结束
  //不依赖 URL 和 URLSearchParams 的解析：结束
  // 普通解析与字符串化：结束
  // Object扩展：开始

  var objectPropertyDescriptors = {
    //URL相关：开始

    /**
     * toJSONqueryStringify(queryPrefix)
     * 把当前对象 用JSON的方式格式化成 URL 的参数格式
     * @param queryPrefix ? : boolean    可选；默认值：false; 是否带URL的查询字符串前缀 ?
     * @returns 格式化后的 URL 的参数格式
     *
     * 说明
     * 本方法是通过 JSONQueryStringify 方法进行格式化的
     */
    toJSONqueryStringify: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(queryPrefix) {
        return JSONQueryStringify(this, queryPrefix);
      }
    } //URL相关：结束

  };
  Object.defineProperties(Object.prototype, objectPropertyDescriptors); // Object扩展：结束
  // String扩展：开始

  var stringPropertyDescriptors = {
    /**
     * 获取当前字符串经过 parseJSONQueryString 解析成的 对象；
     *
     * 说明：
     * 本方法是通过 parseJSONQueryString 方法进行解析的；
     */
    urlJSONQueryObj: {
      configurable: true,
      get: function get() {
        return parseJSONQueryString(this);
      }
    }
  };
  Object.defineProperties(String.prototype, stringPropertyDescriptors); // String扩展：结束

  function _createForOfIteratorHelper$1(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$2(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * multipleLoop(option)=> stopLoop()
   * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
   * @param option : {loopCall,complete,stepComplete,thisValue,total,step,delay}   选项对象
   * @property option.loopCall : (index,stepCount,total)=>stopInfo : any  必选；每次循环的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
   * @property option.stepComplete ？ : (index,stepCount,total)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数； 返回 stopInfo : any 停止循环并返回停止相关的信息；
   * @property option.complete ？: (stopInfo,index,stepCount,total)=>Void  可选；循环结束时的回调函数； 入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 total: number 循环的总数；
   * @property option.thisValue ? : any   loopCall、complete、stepComplete 回调函数的this的值；
   * @property option.total ? : number   可选；默认值：无穷大 Number.POSITIVE_INFINITY ; 设置总数循环次数；
   * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
   * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
   * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
   */

  function multipleLoop(_ref) {
    var loopCall = _ref.loopCall,
        complete = _ref.complete,
        stepComplete = _ref.stepComplete,
        thisValue = _ref.thisValue,
        _ref$total = _ref.total,
        total = _ref$total === void 0 ? Number.POSITIVE_INFINITY : _ref$total,
        _ref$step = _ref.step,
        step = _ref$step === void 0 ? 50 : _ref$step,
        _ref$delay = _ref.delay,
        delay = _ref$delay === void 0 ? 0 : _ref$delay;
    var index = 0;
    var stepCount = 0; //已经完成了多少批遍历

    /**
     * 设置是否要停止循环；
     *
     * 之所以通过函数来设置，而不是直接给stop变量赋值，是因为：
     * - 确定 结束循环时 只调用一次  complete ；
     */

    var stop = false; //停止循环的开关；表示是否终止循环；

    function setStop(newValue) {
      if (newValue) {
        stop = newValue;

        if (complete) {
          complete.call(thisValue, stop, index, stepCount, total);
        }
      }
    }
    /**
     * 是否需要循环；
     * @returns boolean
     *
     * 之所以定义成函数形式，而不定义成变量，是因为：
     * - 减少代码冗余；
     * - 确定 结束循环时 只调用一次  complete ；
     */


    function loop() {
      var needLoop = index < total;

      if (!needLoop && complete) {
        complete.call(thisValue, false, index - 1, stepCount, total);
      }

      return needLoop;
    }

    var timeoutId = null;
    /**
     * 自调用单次循环
     */

    function atuoSingleLoop() {
      stepCount++;
      var singleTotal = Math.min(index + step, total);

      function singleLoop() {
        return index < singleTotal;
      }

      while (singleLoop() && !stop) {
        setStop(loopCall.call(thisValue, index, stepCount, total));
        index++;
      }

      if (stepComplete) {
        setStop(stepComplete.call(thisValue, index - 1, stepCount, total));
      }

      if (loop() && !stop) {
        timeoutId = setTimeout(atuoSingleLoop, delay);
      }
    }
    /**
     * 停止循环
     */


    function stopLoop(stopInfo) {
      if (!stopInfo) {
        stopInfo = true;
      }

      clearTimeout(timeoutId);
      setStop(stopInfo);
    }

    if (loop()) {
      //开始循环
      atuoSingleLoop();
    }

    return stopLoop;
  }
  var arrayPropertyDescriptors = {
    /**
     * multipleLoop(option)=> stopLoop()
     * 多次遍历、分批循环；可以把一个大遍历分成若干个小遍历来完成；
     * @param option : {loopCall,complete,stepComplete,thisValue,step,delay}   选项对象
     * @property option.loopCall : (currentValue,index,stepCount,arr)=>stopInfo : any  必选；每次循环的回调函数；入参 currentValue : Item  当前index对应数组元素； 入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr:Array 当前被循环的数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
     * @property option.stepComplete ？ : (index,stepCount,arr)=>stopInfo : any  可选；每批循环完成时的回调函数；入参  index : number  表示当前循环的 index，从0开始；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组； 返回 stopInfo : any 停止循环并返回停止相关的信息；
     * @property option.complete ？: (stopInfo,index,stepCount,arr)=>Void  可选；循环结束时的回调函数；入参 stopInfo : any 停止循环遍历时停止信息；入参  index : number  表示最后一次循环的 index，如果值为-1 表示没有进行过循环值终止了；入参 stepCount : number  表示已经遍历的批数、周期数；入参 arr: Array 被循环的数组，即当前数组；
     * @property option.thisValue ? : any   可选；默认值：当前数组； loopCall、complete、stepComplete  回调函数的this的值；
     * @property option.step ? : number    可选； 默认值： 50 ； 设置每次遍历的循环次数；
     * @property option.delay ? : Timestamp   可选；默认值 ：0 ； 设置再次遍历的间隔时间；
     * @returns stopLoop : (stopInfo)=>Void    停止循环的函数；调用该函数，会终止正在进行的循环； 入参 stopInfo : any 停止循环的相关信息
     */
    multipleLoop: {
      configurable: true,
      writable: true,
      enumerable: false,
      value: function value(_ref2) {
        var _this2 = this;

        var _loopCall = _ref2.loopCall,
            complete = _ref2.complete,
            stepComplete = _ref2.stepComplete,
            thisValue = _ref2.thisValue,
            step = _ref2.step,
            delay = _ref2.delay;

        if (thisValue) {
          thisValue = this;
        }

        var loopOpt = {
          loopCall: function loopCall(index, stepCount, total) {
            return _loopCall.call(thisValue, _this2[index], index, stepCount, _this2);
          },
          total: this.length,
          step: step,
          delay: delay
        };

        if (complete) {
          loopOpt.complete = function (stopInfo, index, stepCount, total) {
            return complete.call(thisValue, stopInfo, index, stepCount, _this2);
          };
        }

        if (stepComplete) {
          loopOpt.stepComplete = function (index, stepCount, total) {
            return stepComplete.call(thisValue, index, stepCount, _this2);
          };
        }

        return multipleLoop(loopOpt);
      }
    }
  };
  Object.defineProperties(Array.prototype, arrayPropertyDescriptors); //遍历优化：结束

  /**
   * safelyIterate(iterable,operation, thisValue)
   * 对 iterable  进行安全的迭代；与 for...of 的区别是：safelyIterate 能保证会迭代过程不会受 operation 中的行为的影响从而迭代每一个元素；
   * @param iterable : Iterable   必选； 可迭代的对象；
   * @param operation : (currentValue,currentIndex,iterable)=>boolean | undefined     执行的操作， 该函数的返回值表示是否要过滤出该元素
   * @param thisValue ? : any   可选，默认值是 iterable ；操作 operation 的 this 值
   * @returns [Item]  返回被 operation 过滤出的元素
   *
   *
   * operation(currentValue,currentIndex,iterable)=>boolean | undefined
   * @param currentValue : any   调用 operation 时的元素的值；
   * @param currentIndex : number     currentValue 在原始 iterable 中 对应的迭代索引值；
   * @param iterable : Iterable   被迭代的 iterable ；
   * @returns boolean | undefined  表示是否要过滤出 currentValue ；
   *
   */

  function safelyIterate(iterable, operation, thisValue) {
    if (thisValue == undefined) {
      thisValue = iterable;
    }

    var arrayCopy = [];

    var _iterator = _createForOfIteratorHelper$1(iterable),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var value = _step.value;
        arrayCopy.push(value);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var filterItem = arrayCopy.filter(function (currentValue) {
      var currentIndex = this.indexOf(currentValue);
      operation.call(thisValue, currentValue, currentIndex, iterable);
    }, arrayCopy);
    return filterItem;
  } //类型：开始

  var propertyDescriptors$3 = {
    /**
     * searchParams
     * 注意：
     * 该属性是计算属性，每一都会返回一个新的 URLSearchParams 实例；所以，若想通过该属性更改url的参数，需要给该属性重新赋值，而不能基于该属性返回的 URLSearchParams 的实例设置；
     */
    searchParams: {
      configurable: true,
      enumerable: false,
      get: function get() {
        return new window.URLSearchParams(this.search);
      },
      set: function set(newValue) {
        this.search = newValue.toString();
      }
    },

    /**
     * get:把 URLSearchParams 转换对象形式；
     * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
     */
    params: {
      configurable: true,
      enumerable: false,
      get: function get() {
        return parseQueryString(this.search, function (value) {
          return JSON.correctParse(value);
        });
      },
      set: function set(newValue) {
        this.search = queryStringify(newValue, function (value, key, params) {
          if (_typeof_1(value) == "object") {
            value = JSON.stringify(value);
          }

          return value;
        });
      }
    }
  };
  Object.defineProperties(Location.prototype, propertyDescriptors$3);

  //URL扩展：开始
  if (!globalThis.URL && globalThis.webkitURL) {
    globalThis.URL = globalThis.webkitURL;
  }

  if (globalThis.URL) {
    var propertyDescriptors$4 = {
      /**
       * get:把 URLSearchParams 转换对象形式；
       * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
       */
      params: {
        configurable: true,
        enumerable: false,
        get: function get() {
          return this.searchParams.toParams();
        },
        set: function set(newValue) {
          this.searchParams.resetParams(newValue);
        }
      }
    };
    Object.defineProperties(globalThis.URL.prototype, propertyDescriptors$4);
  } //URL扩展：结束
  //依赖 URL 和 URLSearchParams 的解析：开始

  /**
   * 字符串化 url 对象
   * @param urlObj : Object | URL | Location | string | 其它    必选；url 对象
   * @param replace : boolean     可选；默认值：false ;  url参数部分是否需要把旧的给替换掉
   * @returns urlStr  : string   返回url字符串
   *
   *
   *
   * @property urlObj.href  : string    字符串形式的url地址
   * @property urlObj.protocol  : string    包含URL对应协议的一个DOMString，最后有一个":"。
   * @property urlObj.host  : string    包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号
   * @property urlObj.pathname  : string    包含URL中路径部分的一个DOMString，开头有一个“/"。
   * @property urlObj.hash  : string    包含块标识符的DOMString，开头有一个“#”。
   * @property urlObj.params  : string | Object    url的参数对象 或者 字符串
   *
   */


  function stringifyUrlByURLClass(urlObj, replace) {
    if (_typeof_1(urlObj) != "object") {
      return urlObj;
    }

    var urlType = urlObj.constructor.name;

    switch (urlType) {
      case "URL":
      case "Location":
        {
          return urlObj.href;
        }

      default:
        {
          var href = urlObj.href,
              protocol = urlObj.protocol,
              host = urlObj.host,
              pathname = urlObj.pathname,
              params = urlObj.params,
              hash = urlObj.hash;
        }
    }

    var urlInst = new globalThis.URL(href);

    if (protocol) {
      urlInst.protocol = protocol;
    }

    if (host) {
      urlInst.host = host;
    }

    if (pathname) {
      var pathURLInst = new globalThis.URL(pathname, href);
      urlInst.pathname = pathURLInst.pathname;
    }

    if (hash) {
      urlInst.hash = hash;
    }

    if (params) {
      var searchParams = urlInst.searchParams;

      var paramsType = _typeof_1(params);

      if (_typeof_1(params) != "object") {
        if (replace) {
          urlInst.search = params;
        } else {
          var oriSearch = urlInst.search;
          var separ = oriSearch ? "&" : "";
          urlInst.search = oriSearch + separ + params;
        }
      } else {
        if (replace) {
          searchParams.resetParams(params);
        } else {
          searchParams.setParams(params);
        }
      }
    }

    return urlInst.href;
  }
  /**
   * 把 url 解析成普通的对象
   * @param url : string | URL | Location   必选；url 字符串 或者 URL、Location 实例
   * @returns urlObj  : { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams,params }   返回 包含URL所有信息的普通对象
   *
   *
   * @property urlObj.params  : Object    url的参数对象
   * 注意： urlObj 的其它属性跟 URL 实例的属性一样；即实现了 URLUtils 中定义的属性
   *
   */

  function parseUrlByURLClass(url) {
    var urlInst = url;

    if (typeof url == "string") {
      urlInst = new globalThis.URL(url);
    }

    var _urlInst = urlInst,
        href = _urlInst.href,
        protocol = _urlInst.protocol,
        host = _urlInst.host,
        hostname = _urlInst.hostname,
        port = _urlInst.port,
        pathname = _urlInst.pathname,
        search = _urlInst.search,
        hash = _urlInst.hash,
        username = _urlInst.username,
        password = _urlInst.password,
        origin = _urlInst.origin,
        searchParams = _urlInst.searchParams;
    var urlObj = {
      href: href,
      protocol: protocol,
      host: host,
      hostname: hostname,
      port: port,
      pathname: pathname,
      search: search,
      hash: hash,
      username: username,
      password: password,
      origin: origin,
      searchParams: searchParams
    };

    if (!searchParams && search) {
      searchParams = new globalThis.URLSearchParams(search);
    }

    if (searchParams) {
      var params = searchParams.toParams();
    }

    urlObj.params = params;
    return urlObj;
  } //依赖 URL 和 URLSearchParams 的解析：结束

  if (!globalThis.URLSearchParams && globalThis.URL) {
    var _URLsearchParamsInst_ = new globalThis.URL("gby://guo.bin.yong").searchParams;

    var _URLSearchParamsConstructor_ = _URLsearchParamsInst_ && _URLsearchParamsInst_.constructor;

    if (typeof _URLSearchParamsConstructor_ == "function") {
      globalThis.URLSearchParams = _URLSearchParamsConstructor_;
    }
  }

  if (globalThis.URLSearchParams) {
    var propertyDescriptors$5 = {
      /**
       * toParams()
       * 把 URLSearchParams 转换对象形式；
       */
      toParams: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value() {
          var params = {};
          this.forEach(function (value, key) {
            params[key] = value;
          });
          return params;
        }
      },

      /**
       * clear()
       * 清除所有的 key
       */
      clear: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value() {
          var _this = this;

          safelyIterate(this.keys(), function (key) {
            _this["delete"](key);
          });
        }
      },

      /**
       * appendParams(params)
       * 将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
       * @param params : Object | string | URLSearchParams  该 对象自身 或 查询字符串 的所有成员都会被插入进来
       *
       * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
       */
      appendParams: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value(params) {
          var _this2 = this;

          var paramsSP = params;

          switch (params.constructor) {
            case String:
              {
                paramsSP = new globalThis.URLSearchParams(params);
              }

            case globalThis.URLSearchParams:
              {
                paramsSP.forEach(function (value, key) {
                  _this2.append(key, value);
                });
                break;
              }

            default:
              {
                Object.keys(params).forEach(function (key) {
                  _this2.append(key, params[key]);
                });
              }
          }
        }
      },

      /**
       * setParams(params)
       * URLSearchParams接口的 setParams(params) 方法用于将 params  对象自身 或 查询字符串 的所有可枚举成员 设置成搜索参数的成员。如果设置前已经存在匹配的值，该方法会删除多余的，如果将要设置的值不存在，则创建它
       * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
       *
       * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
       */
      setParams: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value(params) {
          var _this3 = this;

          var paramsSP = params;

          switch (params.constructor) {
            case String:
              {
                paramsSP = new globalThis.URLSearchParams(params);
              }

            case globalThis.URLSearchParams:
              {
                paramsSP.forEach(function (value, key) {
                  _this3.set(key, value);
                });
                break;
              }

            default:
              {
                Object.keys(params).forEach(function (key) {
                  _this3.set(key, params[key]);
                });
              }
          }
        }
      },

      /**
       * resetParams(obj)
       * 清除之前所有的搜索参数，并将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
       * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
       */
      resetParams: {
        configurable: true,
        writable: true,
        enumerable: false,
        value: function value(params) {
          this.clear();
          this.appendParams(params);
        }
      }
    };
    Object.defineProperties(globalThis.URLSearchParams.prototype, propertyDescriptors$5);
  }

  /**
   * elementIsMatchSelector(element,selector,parentNode)
   * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 element
   * 或者可以理解为：
   * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
   * @param element : Element   被测试的元素
   * @param selector : string   css 选择器
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   */

  function elementIsMatchSelector(element, selector, parentNode) {
    if (!parentNode) {
      parentNode = document;
    }

    if (!parentNode.contains(element)) {
      return false;
    }

    var elemList = parentNode.querySelectorAll(selector);
    var elemArray = Array.from(elemList);
    return elemArray.some(function (qsElem) {
      return element.isSameNode(qsElem);
    });
  }
  /**
   * isMatchSelector(selector,parentNode)
   * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
   * 或者可以理解为：
   * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
   * @param selector : string   css 选择器
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   */

  Element.prototype.isMatchSelector = function isMatchSelector(selector, parentNode) {
    return elementIsMatchSelector(this, selector, parentNode);
  };
  /**
   * elementIsMatchOption(element,option,parentNode)
   * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含元素 element
   * 或者可以理解为：
   * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
   * @param element : Element   被测试的元素
   * @param option : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   *
   *
   * 注意：
   * option的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
   * option 中可配置如下属性：
   * tag ? : string   可选； 元素的标签名字
   * id ? : string  可选； 元素的id
   * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
   * selector : string    可选；css选择器
   *
   */


  function elementIsMatchOption(element, option, parentNode) {
    if (!parentNode) {
      parentNode = document;
    }

    if (typeof option == "string") {
      option = {
        selector: option
      };
    }

    return Object.keys(option).every(function (key) {
      var value = option[key];
      var keyMatch = true;

      switch (key) {
        case "tag":
          {
            if (value) {
              value = value.toLowerCase();
            }

            keyMatch = element.localName == value && element.tagName.toLowerCase() == value;
            break;
          }

        case "id":
          {
            keyMatch = element.id == value;
            break;
          }

        case "class":
          {
            if (Array.isArray(value)) {
              var classArr = Array.from(element.classList);
              keyMatch = classArr.isContains(value);
            } else {
              keyMatch = element.className == value;
            }

            break;
          }

        case "selector":
          {
            keyMatch = element.isMatchSelector(value, parentNode);
            break;
          }
      }

      return keyMatch;
    });
  }
  /**
   * isMatchOption(option,parentNode)
   * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含当前元素
   * 或者可以理解为：
   * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
   * @param option : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   *
   *
   * 注意：
   * option的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
   * option 中可配置如下属性：
   * tag ? : string   可选； 元素的标签名字
   * id ? : string  可选； 元素的id
   * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
   * selector : string    可选；css选择器
   *
   */

  Element.prototype.isMatchOption = function isMatchOption(option, parentNode) {
    return elementIsMatchOption(this, option, parentNode);
  };
  /**
   * elementIsMatchSomeOptions(element,optionArr,parentNode)
   * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
   * @param element : Element   被测试的元素
   * @param optionArr : Array<Option>   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   *
   *
   * 注意：
   * Option的各种配置项是且的关系，即：Option 中设置的所有配置项都匹配才算通过
   * Option 中可配置如下属性：
   * tag ? : string   可选； 元素的标签名字
   * id ? : string  可选； 元素的id
   * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
   * selector : string    可选；css选择器
   *
   */


  function elementIsMatchSomeOptions(element, optionArr, parentNode) {
    return optionArr.some(function (option) {
      return elementIsMatchOption(element, option, parentNode);
    });
  }
  /**
   * isMatchSomeOptions(optionArr,parentNode)
   * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
   * @param optionArr : Array<Option>   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   *
   *
   * 注意：
   * Option的各种配置项是且的关系，即：Option 中设置的所有配置项都匹配才算通过
   * Option 中可配置如下属性：
   * tag ? : string   可选； 元素的标签名字
   * id ? : string  可选； 元素的id
   * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
   * selector : string    可选；css选择器
   *
   */

  Element.prototype.isMatchSomeOptions = function isMatchSomeOptions(optionArr, parentNode) {
    return elementIsMatchSomeOptions(this, optionArr, parentNode);
  }; // Element：结束
  // EventTarget：开始

  /**
   * 创建并返回一个指定次数的事件监听器
   * @param handler : (event:Event, ...paramList)=>Void     用户的自定义的事件处理程序；
   * @param times : number    事件的触发次数
   * @param timeout : number    事件的有效时长
   * @param paramList : Array    自定义参数列表，该列表中的所有元素都会作为 handler 的参数跟在 event 事件对象后面；
   * @returns manyTimesEventListener : (event:Event)=>Void     可直接被当作事件处理程序的函数；
   *
   */


  function createManyTimesEventListener(handler, times, timeout, paramList) {
    times = times == undefined ? 1 : times;
    timeout = timeout == undefined ? 300 : timeout;
    var eventMap = {};
    /**
     * 被创建的事件监听器
     * @param event : Event   事件对象
     */

    var manyTimesEventListener = function manyTimesEventListener(event) {
      var _this = this;

      var eventType = event.type;
      var eventList = eventMap[eventType];

      if (!eventList) {
        eventList = [];
        eventMap[eventType] = eventList;
      } //找出事件的 type、target、currentTarget 都相同的事件对象；


      var sameEvent = eventList.find(function (eventItem, index) {
        return eventItem.target == event.target && eventItem.listenTarget == event.currentTarget;
      });

      if (sameEvent) {
        sameEvent.currentTimes++; //增加点击次数
      } else {
        //事件初次触发

        /**
         * 把 currentTimes 记录在 sameEvent 中；
         * 把 currentTarget 保存在 listenTarget 属性中；因为事件响应链结束后，事件对象的 currentTarget 会被释放；
         * @property currentTimes : number   记录相应事件的触发次数
         */
        sameEvent = event;
        sameEvent.currentTimes = 1;
        sameEvent.listenTarget = sameEvent.currentTarget; //设置计时器

        setTimeout(function (currentEvent) {
          var currentTimes = currentEvent.currentTimes;

          if (currentTimes == times) {
            //符合次数才执行真正的事件处理函数
            var handlerParamListh = paramList ? [currentEvent].concat(paramList) : [currentEvent]; //不能更改 paramList ，因为下次调用时还会用到

            handler.apply(_this, handlerParamListh);
          }

          currentEvent.listenTarget = null;
          var myEventTypeList = eventMap[currentEvent.type];
          var currentEventIndex = myEventTypeList.indexOf(currentEvent);
          myEventTypeList.splice(currentEventIndex, 1);
        }, timeout, sameEvent);
        eventList.push(sameEvent);
      }
    };

    return manyTimesEventListener;
  } // EventTarget：结束
  // Input：开始

  /**
   * 本方法是用于解决ipnut输入框在触摸屏中不灵敏的问题，该问题的原因有以下两点（其中第一个原因是主要原因）：
   * 1. 触发input元素获取焦点的事件有延迟；
   * 2. input元素的响应范围较小；
   *
   * 解决方案：
   * 当input或其父元素上触发无延迟事件时，用代码让input元素获取焦点；
   * 经过测试，推荐用无延迟的事件有：touchstart、click 等
   *
   *
   * focusInputOnTargetOfEvent(targetTests,eventName,excludeInput)
   * 在 eventName事件触发在符合条件的目标元素上时，将焦点聚焦到该元素的后代元素中的 第一个input元素 或 目标元素本身（当目标元素是input元素时）
   * @param targetTests : Array< targetFun | ElementMatchOption>    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
   * @param eventName ? : string     可选；默认值："click"； 监听事件的名字
   * @param excludeInput ? :  boolean  可选；默认值：false ; 表示当点击的目标元素是input元素时，不做设置焦点的动作；即 排除目标元素是input的情况
   *
   *
   * targetFun : (targetElement)=>boolean   测试函数
   * elementMatchOption : {tag:string, id:string, class:string | Array,  selector:string}   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
   *
   * elementMatchOption的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
   * option 中可配置如下属性：
   * tag ? : string   可选； 元素的标签名字
   * id ? : string  可选； 元素的id
   * class ? : string | Array  可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
   * selector : string    可选；css选择器
   *
   */

  function focusInputOnTargetOfEvent(targetTests, eventName, excludeInput) {
    if (!Array.isArray(targetTests)) {
      targetTests = [targetTests];
    }

    if (!eventName) {
      eventName = "click";
    }
    /**
     * 测试 testArr 中是否有 符合 target 的 test； 即
     * @param target
     * @param testArr
     * @returns boolean
     */


    function testTarget(target, testArr) {
      return testArr.some(function (test) {
        if (typeof test == "function") {
          return test(target);
        } else {
          return target.isMatchOption(test);
        }
      });
    }

    document.addEventListener(eventName, function (event) {
      var target = event.target;

      if (testTarget(target, targetTests)) {
        if (target.localName == "input") {
          if (!excludeInput) {
            target.focus();
          }
        } else {
          var inputDom = target.getElementsByTagName("input")[0];

          if (inputDom) {
            inputDom.focus();
          }
        }
      }
    });
  } // Input：结束

  /**
   * 加载脚本文件
   * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
   * @return {HTMLScriptElement}
   */

  function loadScript(scriptProps) {
    if (_typeof_1(scriptProps) != "object") {
      scriptProps = {
        src: scriptProps
      };
    }

    var _scriptProps = scriptProps,
        src = _scriptProps.src,
        otherPross = objectWithoutProperties(_scriptProps, ["src"]);

    var scriptEle = document.createElement("script");
    Object.assign(scriptEle, otherPross);
    scriptEle.src = src;
    document.body.appendChild(scriptEle);
    return scriptEle;
  }
  /**
   * prohibitWindowHeightChangeWhenInput(cancel)
   * 禁止当弹出键盘时 winodw 窗口改变高度
   * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
   */

  function prohibitWindowHeightChangeWhenInput(cancel) {
    if (cancel) {
      var focusinHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__;

      if (focusinHandler) {
        document.removeEventListener("focusin", focusinHandler);
        prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
      }

      var focusoutHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__;

      if (focusoutHandler) {
        document.removeEventListener("focusin", focusoutHandler);
        prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
      }

      return;
    } // focusin 事件处理器


    prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusin_Handler__(event) {
      var htmlDom = document.documentElement;
      var htmlStyle = htmlDom.style;
      var bodyDom = document.body;
      var bodyStyle = bodyDom.style; //保存原始样式；

      prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = {
        html: htmlStyle.height,
        body: bodyStyle.height
      }; //设置html和body的高度为窗口变化前的空度

      var compStyleOfHtml = window.getComputedStyle(htmlDom);
      htmlStyle.height = compStyleOfHtml.height;
      var compStyleOfBody = window.getComputedStyle(bodyDom);
      bodyStyle.height = compStyleOfBody.height;
    }; //把事件加到 document 是为加快事件的处理速度
    //添加 focusin 事件处理器


    document.addEventListener("focusin", prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__); // focusout 事件处理器

    prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusout_Handler__(event) {
      //还原html 和 body 的原始高度
      var oriHeightStyle = prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ || {
        html: null,
        body: null
      };
      document.documentElement.style.height = oriHeightStyle.html;
      document.body.style.height = oriHeightStyle.body;
      prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = null;
    }; //添加 focusout 事件处理器


    document.addEventListener("focusout", prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__);
  }

  exports.createManyTimesEventListener = createManyTimesEventListener;
  exports.elementIsMatchOption = elementIsMatchOption;
  exports.elementIsMatchSelector = elementIsMatchSelector;
  exports.elementIsMatchSomeOptions = elementIsMatchSomeOptions;
  exports.focusInputOnTargetOfEvent = focusInputOnTargetOfEvent;
  exports.loadScript = loadScript;
  exports.parseUrlByURLClass = parseUrlByURLClass;
  exports.prohibitWindowHeightChangeWhenInput = prohibitWindowHeightChangeWhenInput;
  exports.stringifyUrlByURLClass = stringifyUrlByURLClass;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
