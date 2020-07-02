
const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomizeEvent extends cc.Component {

    private static m_instance: CustomizeEvent = null;

    private m_eventObjectArray;

    private constructor() {
        super();
        this.m_eventObjectArray = {};
    }
    public static getInstance(): CustomizeEvent {
        if (this.m_instance == null) {
            this.m_instance = new CustomizeEvent();
        }
        return this.m_instance;
    }   

    /**
     * @param name 
     * @param listener 
     * @param thisObject 
     */
    public MFAddEventListener(name: string | number, listener: Function, thisObject: any): void {
        if (!listener) {
            throw new Error("MFAddEventListener listener is null")
        }
        if (!thisObject) {
            throw new Error("MFAddEventListener thisObject is null")
        }

        this.m_eventObjectArray[name] = this.m_eventObjectArray[name] || [];
        let listennerData = {
            listener: listener,
            object: thisObject,
        }
        this.m_eventObjectArray[name].push(listennerData);
    }

    /**
     * DispatchEvent 
     * @param name 
     * @param data 
     */
    public MFDispatchEvent(name: number | string, data: any): void {
        if (!name) {
            throw new Error("MFDispatchEvent name is null")
        }
        let listennerDataArray = this.m_eventObjectArray[name] || [];
        for (let i = 0; i < listennerDataArray.length; i++) {
            let listennerData = listennerDataArray[i];
            listennerData.listener.call(listennerData.object, data);
        }
    }

    /**
     * remove event listener 
     * listener is not null cache only remove this listener
     * @param name
     * @param listener
     */
    public MFRemoveEventListener(name: number | string, listener: Function): void {
        if (!name) {
            throw new Error("MFRemoveEventListener name is null")
        }

        if (!listener) {
            throw new Error("MFRemoveEventListener listener is null")
        }

        let listennerDataArray = this.m_eventObjectArray[name] || [];
        for (let i = 0; i < listennerDataArray.length; i++) {
            let listennerData = listennerDataArray[i];
            if (listennerData.listener == listener) {
                listennerDataArray.splice(i, 1);
                break;
            }
        }
    }
}
