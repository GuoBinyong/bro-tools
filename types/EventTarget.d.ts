
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
