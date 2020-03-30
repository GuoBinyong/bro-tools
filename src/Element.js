




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
export function elementIsMatchSelector(element,selector,parentNode) {
    if (!parentNode) {
      parentNode = document;
    }
  
    if (!parentNode.contains(element)){
       return false;
    }
  
    var elemList =  parentNode.querySelectorAll(selector);
    var elemArray = Array.from(elemList);
    return elemArray.some(function(qsElem){
      return element.isSameNode(qsElem);
    });
  
  };
  
  
  
  
  /**
   * isMatchSelector(selector,parentNode)
   * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
   * 或者可以理解为：
   * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
   * @param selector : string   css 选择器
   * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
   * @returns boolean
   */
  Element.prototype.isMatchSelector = function isMatchSelector(selector,parentNode) {
    return elementIsMatchSelector(this,selector,parentNode)
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
export function elementIsMatchOption(element,option,parentNode) {
    if (!parentNode) {
      parentNode = document;
    }
  
    if (typeof option == "string"){
      option = {selector:option};
    }
  
    return Object.keys(option).every(function (key) {
      var value = option[key];
      var keyMatch = true;
      switch (key) {
  
        case "tag":{
          if (value){
            value = value.toLowerCase();
          }
          keyMatch = element.localName == value && element.tagName.toLowerCase() == value;
          break
        }
  
        case "id":{
          keyMatch = element.id == value;
          break
        }
  
        case "class":{
  
          if (Array.isArray(value)) {
            var classArr = Array.from(element.classList);
            keyMatch = classArr.isContains(value);
  
          }else {
            keyMatch = element.className == value;
          }
  
          break
        }
  
  
        case "selector":{
          keyMatch = element.isMatchSelector(value,parentNode);
          break
        }
  
      }
  
  
      return keyMatch;
    });
  };
  
  
  
  
  
  
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
  Element.prototype.isMatchOption =  function isMatchOption(option,parentNode) {
    return elementIsMatchOption(this,option,parentNode);
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
export function elementIsMatchSomeOptions(element,optionArr,parentNode) {
    return optionArr.some(function (option) {
      return elementIsMatchOption(element,option,parentNode);
    });
  };
  
  
  
  
  
  
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
  Element.prototype.isMatchSomeOptions =  function isMatchSomeOptions(optionArr,parentNode) {
    return elementIsMatchSomeOptions(this,optionArr,parentNode);
  };
  
  
  
  
  
  