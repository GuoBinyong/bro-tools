
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
        var sameEvent = eventList.find(function(eventItem){
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

}
