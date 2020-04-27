import "com-tools"

declare global {

    interface URL {

        /**
         * get:把 URLSearchParams 转换对象形式；
         * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
         */
            params:any;
     }
}






//依赖 URL 和 URLSearchParams 的解析：开始

interface UrlUtilsByURLClass {
    href? : string;    //字符串形式的url地址
protocol?: string;    //包含URL对应协议的一个DOMString，最后有一个":"。
host?: string;    //包含了域名的一个DOMString，可能在该串最后带有一个":"并跟上URL的端口号
pathname?: string;    //包含URL中路径部分的一个DOMString，开头有一个“/"。
hash?: string ;   //包含块标识符的DOMString，开头有一个“#”。
params?: any;    //url的参数对象 或者 字符串
}

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
export function stringifyUrlByURLClass(urlObj:UrlUtilsByURLClass | URL | Location | string, replace?:boolean):string;









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
export function parseUrlByURLClass(url:string | URL | Location):UrlUtils;





//依赖 URL 和 URLSearchParams 的解析：结束

