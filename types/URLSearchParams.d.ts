
interface URLSearchParams {


    /**
     * toParams()
     * 把 URLSearchParams 转换对象形式；
     */
    toParams(): any;


    /**
     * clear()
     * 清除所有的 key
     */
    clear(): void;



    /**
     * appendParams(params)
     * 将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
     * @param params : Object | string | URLSearchParams  该 对象自身 或 查询字符串 的所有成员都会被插入进来
     *
     * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
     */
    appendParams(params: object | string | URLSearchParams): void;






    /**
     * setParams(params)
     * URLSearchParams接口的 setParams(params) 方法用于将 params  对象自身 或 查询字符串 的所有可枚举成员 设置成搜索参数的成员。如果设置前已经存在匹配的值，该方法会删除多余的，如果将要设置的值不存在，则创建它
     * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
     *
     * 注意：不要质疑下面的 switch 代码的逻辑，这是正确且高效的，这样写也是为了减少代码量
     */
    setParams(params: object | string | URLSearchParams): void;



    /**
     * resetParams(obj)
     * 清除之前所有的搜索参数，并将 params  对象自身 或 查询字符串 的每一个可枚举成员都插入一个新搜索参数。
     * @param params : Object | string | URLSearchParams 该 对象自身 或 查询字符串 的所有成员都会被插入进来
     */
    resetParams(params: object | string | URLSearchParams): void;

}