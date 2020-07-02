
const { ccclass, property } = cc._decorator;

@ccclass
export default class MFStack<T> {

    private m_uiInfoList: Array<string> = new Array();

    private m_uiInfoMap = new Map();


    /**
     * add one item to stack
     * @param id 
     * @param item 
     */
    public push(id: string, item: T): void {
        this.m_uiInfoList.push(id);
        this.m_uiInfoMap.set(id, item);
    }

    /**
     * return item by index
     * @param index 
     */
    public get(index: number): T {
        let itemId = this.m_uiInfoList[index];
        return this.m_uiInfoMap.get(itemId);
    }

    /**
     * return itemId by index
     * @param index 
     */
    public getItemId(index: number): string {
        let itemId = this.m_uiInfoList[index];
        return itemId;
    }

    /**
     * remove item from stack by id
     * @param id 
     */
    public remove(id: string): T {
        if (!this.m_uiInfoMap.has(id)) {
            return;
        }
        let itemId;
        for (let i = 0; i < this.m_uiInfoList.length; i++) {
            if (this.m_uiInfoList[i] === id) {
                itemId = this.m_uiInfoList.splice(i, 1)[0];
                break;
            }
        }
        let item = this.m_uiInfoMap.get(itemId);
        this.m_uiInfoMap.delete(id);
        return item;
    }


    public containId(id: string): boolean {
        if (this.m_uiInfoMap.has(id)) {
            return true;
        }
        return false;
    }

    /**
     * get last item from stack
     * @param id 
     */
    public peek(): T {
        if (this.m_uiInfoList.length <= 0) {
            return null;
        }
        let lastId: string = this.m_uiInfoList[this.m_uiInfoList.length - 1];
        return this.m_uiInfoMap.get(lastId);
    }


    /**
     * remove last item and return it
     */
    public pop(): T {
        if (this.m_uiInfoList.length <= 0) {
            return null;
        }
        let lastId: string = this.m_uiInfoList.pop();
        let item = this.m_uiInfoMap.get(lastId);
        this.m_uiInfoMap.delete(lastId);
        return item;
    }


    public size(): number {
        return this.m_uiInfoList.length;
    }

    /**
     * clear stack 
     */
    public clear(): void {
        this.m_uiInfoMap.clear();
        this.m_uiInfoList.length = 0;
    }

    /**
     * unActive bottom ui
     */
    public unActiveBottomUI(): void {
        if(this.m_uiInfoList.length > 0) {
            for (let i = 0; i < this.m_uiInfoList.length; i++) {
                let key = this.m_uiInfoList[i];
                let item = this.m_uiInfoMap.get(key);
                item.baseView.node.active = false;
            }
        }  
    }


    /**
     * active top ui view
     */
    public activeTopUI(): void {
        if (this.m_uiInfoList.length <= 0) {
            return;
        }
        let lastId: string = this.m_uiInfoList[this.m_uiInfoList.length - 1];
        let item =  this.m_uiInfoMap.get(lastId);
        if(item) {
            item.baseView.node.active = false;
        }
    }

}
