import type {ElementMatchers, SelectorList,CancelHandler} from "./Element"
import {operateChildElementWhenEventOnTarget} from "./Element"


/**
 * 在 eventName 事件触发在符合条件的目标元素上时，聚焦到匹配的第一个后代元素(包括自身)
 * @param targetElements : ElementMatchers    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
 * @param eventName  : string     监听事件的名字
 * @param selectorsOfOperatedChild : SelectorList   被操作的子元素的选择器
 * @param operator : Operator    执行的操作函数，会在每一个匹配的元素上调用 operator ，并将 元素 和 事件 传给 operator；operator 的返回值 表示是否停止对其它匹配的子元素的进行遍历
 * @param onlyFirst ?:boolean|null|undefined     可选；默认值：false；表示是否针对匹配的第一个子元素调用 operator，忽略匹配的其它子元素
 * @param excludeTargets ?:ElementMatchers|null|undefined  可选； 排除的目标元素；优先级高于 targetElements ，即：如果 目标元素匹配 excludeTargets ，即使该目标元素也匹配 targetElements ，该元素也不会被通过
 *
 * @returns CancelHandler  返回一个函数，调用该函数，可取消 本次 focusChildElementWhenEventOnTarget 的设置
 */
export function focusChildElementWhenEventOnTarget(targetElements:ElementMatchers,eventName:string,selectorsOfFocusedChild:SelectorList,excludeTargets?:ElementMatchers|null|undefined):CancelHandler {
    return operateChildElementWhenEventOnTarget(targetElements,eventName,selectorsOfFocusedChild,function (ele) {
        (<HTMLElement>ele).focus();
    },true,excludeTargets);
}




/**
 * 本方法是用于解决ipnut输入框 或 textarea 在触摸屏中不灵敏的问题，该问题的原因有以下两点（其中第一个原因是主要原因）：
 * 1. 触发input元素获取焦点的事件有延迟；
 * 2. input元素的响应范围较小；
 *
 * 解决方案：
 * 当input或其父元素上触发无延迟事件时，用代码让input元素获取焦点；
 * 经过测试，推荐用无延迟的事件有：touchstart、click 等
 *
 *
 * 在 eventName事件触发在符合条件的目标元素上时，将焦点聚焦到该元素的后代元素中的 第一个input 或 textarea 元素 或 目标元素本身（当目标元素是input 或 textarea 元素时）
 * @param targetElements : ElementMatchers    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
 * @param eventName ? : string     可选；默认值："click"； 监听事件的名字
 * @param excludeSelf ? :  boolean  可选；默认值：false ; 表示当点击的目标元素是 input 或 textarea 元素时，不做设置焦点的动作；即 排除目标元素是 input 或 textarea 的情况
 *
 * @returns CancelHandler  返回一个函数，调用该函数，可取消 本次 focusInputTextareaWhenEventOnTarget 的设置
 */
export function focusInputTextareaWhenEventOnTarget(targetElements:ElementMatchers,eventName?: string|null, excludeSelf?: boolean):CancelHandler {
    const eveName = eventName ? eventName : "click";
    const selectorsOfFocusedChild = "input,textarea";
    const excludeTargets = excludeSelf ? [{tag:"input"},{tag:"textarea"}] : null;
    return focusChildElementWhenEventOnTarget(targetElements,eveName,selectorsOfFocusedChild,excludeTargets);
}
