
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
        var compStyleOfHtml = globalThis.getComputedStyle(htmlDom);
        htmlStyle.height = compStyleOfHtml.height;
        var compStyleOfBody = globalThis.getComputedStyle(bodyDom);
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
