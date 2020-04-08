import "es-expand"





// Element：开始





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





// Element：结束








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
export function createManyTimesEventListener(handler,times,timeout,paramList) {

  times = times == undefined ? 1 : times ;
  timeout = timeout == undefined ? 300 : timeout ;

  var eventMap = {};


  /**
   * 被创建的事件监听器
   * @param event : Event   事件对象
   */
  var  manyTimesEventListener = function(event) {

    var eventType = event.type ;
    var eventList = eventMap[eventType];
    if (!eventList){
      eventList = [] ;
      eventMap[eventType] = eventList ;
    }



    //找出事件的 type、target、currentTarget 都相同的事件对象；
    var sameEvent = eventList.find(function(eventItem, index){
      return eventItem.target == event.target && eventItem.listenTarget == event.currentTarget ;
    });

    if (sameEvent) {
      sameEvent.currentTimes++ ;   //增加点击次数
    }else {  //事件初次触发

      /**
       * 把 currentTimes 记录在 sameEvent 中；
       * 把 currentTarget 保存在 listenTarget 属性中；因为事件响应链结束后，事件对象的 currentTarget 会被释放；
       * @property currentTimes : number   记录相应事件的触发次数
       */
      sameEvent = event ;
      sameEvent.currentTimes = 1;
      sameEvent.listenTarget = sameEvent.currentTarget ;

      //设置计时器
      setTimeout((currentEvent)=> {
        var currentTimes = currentEvent.currentTimes ;
        if (currentTimes == times) { //符合次数才执行真正的事件处理函数
          var handlerParamListh = paramList ? [currentEvent].concat(paramList) : [currentEvent] ;   //不能更改 paramList ，因为下次调用时还会用到
          handler.apply(this,handlerParamListh);
        }

        currentEvent.listenTarget = null ;
        var myEventTypeList = eventMap[currentEvent.type];
        var currentEventIndex = myEventTypeList.indexOf(currentEvent);
        myEventTypeList.splice(currentEventIndex,1);


      },timeout,sameEvent);


      eventList.push(sameEvent);
    }



  };


  return manyTimesEventListener ;

};


// EventTarget：结束




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
export function focusInputOnTargetOfEvent(targetTests,eventName,excludeInput) {

  if (!Array.isArray(targetTests)) {
    targetTests = [targetTests];
  }

  if (!eventName){
    eventName = "click"
  }

  /**
   * 测试 testArr 中是否有 符合 target 的 test； 即
   * @param target
   * @param testArr
   * @returns boolean
   */
  function testTarget(target,testArr) {
    return testArr.some(function (test) {
      if (typeof test == "function") {
        return test(target);
      }else {
        return target.isMatchOption(test);
      }
    });
  }


  document.addEventListener(eventName,function (event) {

    var target = event.target;

    if (testTarget(target,targetTests)) {


      if (target.localName == "input") {

        if (!excludeInput) {
          target.focus();
        }

      }else {

        var inputDom = target.getElementsByTagName("input")[0];
        if (inputDom) {
          inputDom.focus();
        }

      }


    }

  });

}




// Input：结束








/**
 * 加载脚本文件
 * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
 * @return {HTMLScriptElement}
 */
export function loadScript(scriptProps) {
  if (typeof scriptProps != "object"){
    scriptProps = {src:scriptProps};
  }

  var {src,...otherPross} = scriptProps;
  var scriptEle = document.createElement("script");
  Object.assign(scriptEle,otherPross);
  scriptEle.src = src;
  document.body.appendChild(scriptEle);
  return scriptEle;
}






/**
 * prohibitWindowHeightChangeWhenInput(cancel)
 * 禁止当弹出键盘时 winodw 窗口改变高度
 * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
 */
export function prohibitWindowHeightChangeWhenInput(cancel) {

  if (cancel){

    var focusinHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__;
    if (focusinHandler){
      document.removeEventListener("focusin",focusinHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }


    var focusoutHandler = prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__;
    if (focusoutHandler){
      document.removeEventListener("focusin",focusoutHandler);
      prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = null;
    }

    return;
  }

  // focusin 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusin_Handler__(event) {
    var htmlDom = document.documentElement;
    var htmlStyle = htmlDom.style;
    var bodyDom = document.body;
    var bodyStyle = bodyDom.style;

    //保存原始样式；
    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = {
      html:htmlStyle.height,
      body:bodyStyle.height
    };

    //设置html和body的高度为窗口变化前的空度
    var compStyleOfHtml = window.getComputedStyle(htmlDom);
    htmlStyle.height = compStyleOfHtml.height;
    var compStyleOfBody = window.getComputedStyle(bodyDom);
    bodyStyle.height = compStyleOfBody.height;
  };

  //把事件加到 document 是为加快事件的处理速度
  //添加 focusin 事件处理器
  document.addEventListener("focusin",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusin_Handler__);





  // focusout 事件处理器
  prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__ = function __prohibitWindowHeightChangeWhenInput_Focusout_Handler__(event) {
    //还原html 和 body 的原始高度
    var oriHeightStyle = prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ || {html: null,body: null} ;

    document.documentElement.style.height = oriHeightStyle.html;
    document.body.style.height = oriHeightStyle.body;

    prohibitWindowHeightChangeWhenInput.__originalHeightStyle__ = null;
  };

  //添加 focusout 事件处理器
  document.addEventListener("focusout",prohibitWindowHeightChangeWhenInput.__prohibitWindowHeightChangeWhenInput_Focusout_Handler__);


}
