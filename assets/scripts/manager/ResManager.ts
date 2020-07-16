
import { resLoader } from "../resLoader/ResLoader"

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResManager {
    /**
     * use this keep permanentd data
     * use this may be cause double memery cache 
     */
    private m_permanentdMap = {};

    private static m_instance: ResManager = null;

    public static getInstance(): ResManager {
        if (this.m_instance == null) {
            this.m_instance = new ResManager();
        }
        return this.m_instance;
    }

    private constructor() {

    }

    public permanentLoadRes(name: string, completeCallback?: any): void {
        if (this.m_permanentdMap[name]) {
            return;
        }

        resLoader.loadRes(name, (err, res) => {
            if (err) {
                return;
            }
            this.m_permanentdMap[res.name] = res;
            if (completeCallback) {
                completeCallback();
            }
        });
    }

    public getPermanentdByName(name: string): any {
        return this.m_permanentdMap[name];
    }

    public addPermanent(name: string, res: any): void {
        this.m_permanentdMap[name] = res;
    }
}
