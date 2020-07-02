

import { resLoader } from "../resLoader/ResLoader"

const { ccclass, property } = cc._decorator;


interface autoResEntity {
    url: string;
    use?: string;
    type: typeof cc.Asset;
};



@ccclass
export default class BaseUIView extends cc.Component {

    /**
     * 是否将当前ui 放到 uimanager 的 缓存中
     */
    private m_cache: boolean = false;

    /**
     * 当前预制体资源
     */
    private m_autoResArray: Array<autoResEntity> = new Array();

    public constructor() {
        super();
    }

    public getCache(): boolean {
        return this.m_cache;
    }

    public setCache(cache: boolean): void {
        this.m_cache = cache;
    }

    /**
     * @param resEntity 
     */
    public autoReleaseRes(resEntity: autoResEntity): void {
        this.m_autoResArray.push(resEntity);
    }

    /**
     * 释放资源，界面销毁时在UIManager中调用
     */
    public releaseAutoRes() {
        for (let index = 0; index < this.m_autoResArray.length; index++) {
            const element = this.m_autoResArray[index];
            resLoader.releaseRes(element.url, element.type, element.use);
        }
    }


    public onInit(prarm: any): void {

    }

    public onClose(): void {

    }
}
