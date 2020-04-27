//URL扩展：开始
if (!globalThis.URL && globalThis.webkitURL) {
  globalThis.URL = globalThis.webkitURL;
}


if (globalThis.URL) {

  let propertyDescriptors = {

    /**
     * get:把 URLSearchParams 转换对象形式；
     * set: newValue : Object | string | URLSearchParams    把当前URL的查询参数重置成  params
     */
    params: {
      configurable:true,
      enumerable: false,
      get: function () {
        return this.searchParams.toParams();
      },

      set: function (newValue) {
        this.searchParams.resetParams(newValue);
      }
    },
  };


  Object.defineProperties(globalThis.URL.prototype, propertyDescriptors);
}

//URL扩展：结束








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
export function stringifyUrlByURLClass(urlObj, replace){


  if (typeof urlObj != "object"){
    return urlObj;
  }

  let urlType = urlObj.constructor.name;

  switch (urlType){
    case "URL" :
    case "Location" :{
      return urlObj.href;
    }
    default:{
      var { href, protocol, host, pathname, params, hash} = urlObj;
    }
  }




  let urlInst = new globalThis.URL(href);

  if (protocol){
    urlInst.protocol = protocol ;
  }

  if (host) {
    urlInst.host = host;
  }

  if (pathname) {
    let pathURLInst = new globalThis.URL(pathname,href);
    urlInst.pathname = pathURLInst.pathname;
  }

  if (hash) {
    urlInst.hash = hash;
  }



  if (params){
    let searchParams = urlInst.searchParams

    let paramsType = typeof params;

    if (typeof params != "object") {
      if (replace) {
        urlInst.search = params;
      } else {
        let oriSearch = urlInst.search;
        let separ = oriSearch ? "&" : "";
        urlInst.search = oriSearch + separ + params;
      }
    } else {

      if (replace) {
        searchParams.resetParams(params);
      }else {
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
export function parseUrlByURLClass(url){

  let urlInst = url;
  if (typeof url == "string"){
    urlInst = new globalThis.URL(url);
  }

  var { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams } = urlInst;

  let urlObj = { href, protocol,host, hostname,port,pathname,search, hash,username,password,origin,searchParams };


  if (!searchParams && search) {
    searchParams = new globalThis.URLSearchParams(search);
  }

  if  (searchParams){
    var params = searchParams.toParams();
  }

  urlObj.params = params;

  return urlObj;
}





//依赖 URL 和 URLSearchParams 的解析：结束


