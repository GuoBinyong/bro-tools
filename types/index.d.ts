import "js-expand"

export as namespace by;





/**
 * 加载脚本文件
 * @param scriptProps : src | ScriptPropObj   脚本元素的 src 属性值，或脚本元素的属性配置对象
 * @return {HTMLScriptElement}
 */
export function loadScript(scriptProps:string | object):HTMLScriptElement;









/**
 * prohibitWindowHeightChangeWhenInput(cancel)
 * 禁止当弹出键盘时 winodw 窗口改变高度
 * @param cancel ?: boolean    可选；默认值：false；表示是否要 取消 之前禁止
 */
export function prohibitWindowHeightChangeWhenInput(cancel?:boolean):void;







//Element：开始


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
export function elementIsMatchSelector(element: Element, selector: string, parentNode?: Element): boolean;


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
export function elementIsMatchOption(element: Element, option: EleMatchOpts, parentNode?: Element): boolean;


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
export function elementIsMatchSomeOptions(element: Element, optionArr: EleMatchOpts[], parentNode?: Element): boolean;


declare global {


  type EleMatchOpts = {
    tag?: string,
    id?: string,
    class?: string | string[],
    selector?: string
  };


  interface Element {


    /**
     * isMatchSelector(selector,parentNode)
     * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
     * 或者可以理解为：
     * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
     * @param selector : string   css 选择器
     * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
     * @returns boolean
     */
    isMatchSelector(selector: string, parentNode?: Element): boolean;


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
    isMatchOption(option: EleMatchOpts, parentNode?: Element): boolean;


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
    isMatchSomeOptions(optionArr: EleMatchOpts[], parentNode?: Element): boolean;


  }

}


//Element：结束





//EventTarget：开始


/**
 * 创建并返回一个指定次数的事件监听器
 * @param handler : (event:Event, ...paramList)=>Void     用户的自定义的事件处理程序；
 * @param times : number    事件的触发次数
 * @param timeout : number    事件的有效时长
 * @param paramList : Array    自定义参数列表，该列表中的所有元素都会作为 handler 的参数跟在 event 事件对象后面；
 * @returns manyTimesEventListener : (event:Event)=>Void     可直接被当作事件处理程序的函数；
 *
 */
export function createManyTimesEventListener<ArgType>(handler: (event: Event, ...paramList: ArgType[]) => void, times: number, timeout: number, paramList: ArgType[]): EventListener;

//EventTarget：结束




//input：开始



type TargetTestFun = (targetElement: Element) => boolean;


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
export function focusInputOnTargetOfEvent(targetTests: Array<TargetTestFun | EleMatchOpts>, eventName?: string, excludeInput?: boolean): void;


//input：结束
