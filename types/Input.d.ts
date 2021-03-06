import type {ElementMatchers,CancelHandler} from "./Element"



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
 * @param targetTests : ElementMatchers    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
 * @param eventName ? : string | null      可选；默认值："click"； 监听事件的名字
 * @param excludeInput ? :  boolean | null   可选；默认值：false ; 表示当点击的目标元素是input元素时，不做设置焦点的动作；即 排除目标元素是input的情况
 *
 * @returns CancelHandler  返回一个函数，调用该函数，可取消 本次 focusInputOnTargetOfEvent 的设置
 */
export function focusInputOnTargetOfEvent(targetTests: ElementMatchers, eventName?: string|null, excludeInput?: boolean|null): CancelHandler;

