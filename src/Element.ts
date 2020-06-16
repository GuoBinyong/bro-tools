
/*
依赖列表
# Array
isContains
*/
import "es-expand"


/**
 * css选择器；包含一个或多个匹配的选择器。这个字符串必须是一个合法的 CSS selector 如果不是，会抛出一个 SyntaxError 错误；可以通过使用逗号分隔多个选择器来指定它们。
 */
export type Selectors = string;






/**
 * 元素的匹配选项
 *
 * 注意：
 * option的各种配置项是且的关系，即：option中设置的所有配置项都匹配才算通过
 * option 中可配置如下属性：
 * tag ? : string | null   可选； 元素的标签名字
 * id ? : string | null   可选； 元素的id
 * class ? : string | Array | null   可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
 * selector : string | null     可选；css选择器
 */
export type ElementMatchObject = {
    tag?: string | null ,       // 可选； 元素的标签名字
    id?: string | null ,        // 可选； 元素的id
    class?: string | string[] | null ,      // 可选；元素的class ；如果是 字符串，则会与 元素的 className 进行比较，只有完全相等才算通过；如果是 数组，则元素的类包含数组中指定的所有类，才算通过
    selector?: Selectors | null        // 可选；css选择器；包含一个或多个匹配的选择器。这个字符串必须是一个合法的 CSS selector 如果不是，会抛出一个 SyntaxError 错误；可以通过使用逗号分隔多个选择器来指定它们。
};


export type ElementMatchOption = ElementMatchObject | Selectors;







declare global {



    interface Element {


        /**
         * isMatchSelector(selector,parentNode)
         * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
         * 或者可以理解为：
         * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
         * @param selector : string   css 选择器
         * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
         * @returns boolean
         *
         */
        isMatchSelector(selector: string, parentNode?: Element|null): boolean;


        /**
         * isMatchOption(option,parentNode)
         * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含当前元素
         * 或者可以理解为：
         * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
         * @param option : ElementMatchOption   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
         * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
         * @returns boolean
         */
        isMatchOption(option: ElementMatchOption, parentNode?: Element|null): boolean;


        /**
         * isMatchSomeOptions(optionArr,parentNode)
         * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
         * @param optionArr : ElementMatchOption[]   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
         * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
         * @returns boolean
         *
         */
        isMatchSomeOptions(optionArr: ElementMatchOption[], parentNode?: Element|null): boolean;


    }

}







/**
 * elementIsMatchSelector(element,selector,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 element
 * 或者可以理解为：
 * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
 * @param element : Element   被测试的元素
 * @param selector : string   css 选择器
 * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 */
export function elementIsMatchSelector(element: Element, selector: string, parentNode?: Element|null): boolean {
    const parent = parentNode ? parentNode : document;
    if (!parent.contains(element)){
        return false;
    }

    var elemList =  parent.querySelectorAll(selector);
    var elemArray = Array.from(elemList);
    return elemArray.some(function(qsElem){
        return element.isSameNode(qsElem);
    });

}




/**
 * isMatchSelector(selector,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 选择器 selector 的元素是否包含元素 当前元素
 * 或者可以理解为：
 * 当前元素 在 parentNode 节点或其子节点中 是否匹配指定的选择器 selector
 * @param selector : string   css 选择器
 * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 */
Element.prototype.isMatchSelector = function isMatchSelector(selector: string, parentNode?: Element|null): boolean {
    return elementIsMatchSelector(this,selector,parentNode)
};






/**
 * elementIsMatchOption(element,option,parentNode)
 * 测试 在 parentNode 和其子元素中匹配的 匹配选项option 的元素是否包含元素 element
 * 或者可以理解为：
 * 测试目标 element 在 parentNode 节点或其子节点中 是否匹配指定的 匹配选项option
 * @param element : Element   被测试的元素
 * @param option : ElementMatchOption   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
 * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 */
export function elementIsMatchOption(element: Element, option: ElementMatchOption, parentNode?: Element|null): boolean {
    const parent = parentNode ? parentNode : document;
    const matchOpt = typeof option === "string" ? {selector:option} : option;


    return Object.keys(matchOpt).every(function (key) {
        var value = (<any>matchOpt)[key];
        var keyMatch = true;
        switch (key) {

            case "tag":{
                if (value){
                    value = value.toLowerCase();
                }
                keyMatch = element.localName === value && element.tagName.toLowerCase() === value;
                break
            }

            case "id":{
                keyMatch = element.id === value;
                break
            }

            case "class":{

                if (Array.isArray(value)) {
                    var classArr = Array.from(element.classList);
                    keyMatch = classArr.isContains(value);

                }else {
                    keyMatch = element.className === value;
                }

                break
            }


            case "selector":{
                if  (value){
                    keyMatch = element.isMatchSelector(value,parent as Element);
                }
                break
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
 * @param option : ElementMatchOption   匹配选项；注意：各种选项配置项是且的关系，即：选项对象中设置的所有匹配项都匹配才算通过
 * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 */
Element.prototype.isMatchOption =  function isMatchOption(option: ElementMatchOption, parentNode?: Element|null): boolean {
    return elementIsMatchOption(this,option,parentNode);
};






/**
 * elementIsMatchSomeOptions(element,optionArr,parentNode)
 * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
 * @param element : Element   被测试的元素
 * @param optionArr : ElementMatchOption[]   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
 * @param parentNode ? : Element   可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 */
export function elementIsMatchSomeOptions(element: Element, optionArr: ElementMatchOption[], parentNode?: Element|null): boolean {
    return optionArr.some(function (option) {
        return elementIsMatchOption(element,option,parentNode);
    });
}






/**
 * isMatchSomeOptions(optionArr,parentNode)
 * 在 parentNode 节点或其子节点中，  optionArr 数组中 是否存在 元素 element  匹配的 选项
 * @param optionArr : ElementMatchOption[]   匹配选项数组；只要数组中存在匹配的选项对象，就算通过
 * @param parentNode ? : Element | null    可选；默认值：document ; 限定匹配的范围;
 * @returns boolean
 *
 */
Element.prototype.isMatchSomeOptions =  function isMatchSomeOptions(optionArr: ElementMatchOption[], parentNode?: Element|null): boolean {
    return elementIsMatchSomeOptions(this,optionArr,parentNode);
};
















/**
 * 元素匹配函数
 */
export type ElementMatchFun = (targetElement: Element) => boolean;


/**
 * 元素匹配者
 */
export type ElementMatcher = ElementMatchFun | ElementMatchOption

/**
 * 元素匹配数组
 */
export type ElementMatcherArray =  Array<ElementMatcher>;


/**
 * 元素匹配选项
 */
export type ElementMatchers = ElementMatcherArray | ElementMatcher;



/**
 * 选择器数组
 */
export type SelectorsArray = Selectors[];

/**
 * 选择器列表
 * 可以是 字符串的选择器 或 字符串的选择器列表，也可以是一组 字符串选择器 或 字符串选择器列表 组成的数组
 */
export type SelectorList = Selectors | SelectorsArray;









/**
 * 测试 matchOpts 中是否有 符合 target 的 test； 即
 * 测试 匹配选项 matchOpts 中 是否包含 匹配 元素 ele 的匹配选项
 * @param ele:Element   被测试的目标元素
 * @param matchOpts:ElementMatchers     匹配选项
 * @returns boolean
 */
export function testMatchForElement(ele:Element,matchOpts:ElementMatchers):boolean {
    const matcherArr:ElementMatcherArray = Array.isArray(matchOpts) ? matchOpts : [matchOpts];
    return matcherArr.some(function (matcher) {
        if (typeof matcher === "function") {
            return matcher(ele);
        }else {
            return ele.isMatchOption(matcher);
        }
    });
}



/**
 * 操作者
 * @this
 * @param ele: Element   被操作的元素
 * @param evt: Event    事件信息
 * @returns  any   返回的值会被当作布尔值来处理，表示是否停止对匹配元素的遍历；
 *
 * this : Element  被操作的元素
 */

export type Operator = (this:Element,ele:Element,evt: Event)=>any;

/**
 * 取消操作句柄函数
 */
export type CancelHandler = ()=>void;



/**
 * 在 eventName 事件触发在符合条件的目标元素上时，对匹配的后代元素(包括自身)中的进行和遍历操作
 * @param targetElements : ElementMatchers    目标元素是否符合条件的测试选项列表，只要符合其中任一测试选项，就算通过
 * @param eventName  : string     监听事件的名字
 * @param selectorsOfOperatedChild : SelectorList   被操作的子元素的选择器
 * @param operator : Operator    执行的操作函数，会在每一个匹配的元素上调用 operator ，并将 元素 和 事件 传给 operator；operator 的返回值 表示是否停止对其它匹配的子元素的进行遍历
 * @param onlyFirst ?:boolean|null|undefined     可选；默认值：false；表示是否针对匹配的第一个子元素调用 operator，忽略匹配的其它子元素
 * @param excludeTargets ?:ElementMatchers|null|undefined  可选； 排除的目标元素；优先级高于 targetElements ，即：如果 目标元素匹配 excludeTargets ，即使该目标元素也匹配 targetElements ，该元素也不会被通过
 *
 * @returns CancelHandler  返回一个函数，调用该函数，可取消 本次 operateChildElementWhenEventOnTarget 的设置
 */
export function operateChildElementWhenEventOnTarget(targetElements:ElementMatchers,eventName:string,selectorsOfOperatedChild:SelectorList,operator:Operator,onlyFirst?:boolean|null|undefined,excludeTargets?:ElementMatchers|null|undefined):CancelHandler {

    const childSelectors = Array.isArray(selectorsOfOperatedChild) ? selectorsOfOperatedChild.join(",") : selectorsOfOperatedChild;


    function listener(event:Event) {

        const target = event.target as Element;

        if (testMatchForElement(target as Element,targetElements) && !(excludeTargets && testMatchForElement(target as Element,excludeTargets))) {

            let childList:NodeList | Element[] = (<Element>target).querySelectorAll(childSelectors);
            if (childList.length === 0){
                if  (elementIsMatchSelector(target,childSelectors,target.parentNode as Element)){
                    childList = [target];
                }else {
                    return;
                }
            }

            if (onlyFirst){
                const first = childList[0] as Element;
                operator.call(first,first,event);
            }else {
                for (const child  of childList as Element[]){
                    if (operator.call(child,child,event)){
                        return;
                    }
                }
            }


        }

    }


    document.addEventListener(eventName,listener);


    return  function cancelHandler() { document.removeEventListener(eventName,listener);}
}
