import Prop from "./Prop";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PropManager {

    private m_propList: Array<Prop> = new Array();
    private static m_instance: PropManager = null;

    private constructor() { }

    public static getInstance(): PropManager {
        if (this.m_instance == null) {
            this.m_instance = new PropManager();
        }
        return this.m_instance;
    }


    public add(prop: Prop): void {
        this.m_propList.push(prop);
    }

    public remove(prop: Prop): Prop {
        for (let i = 0; i < this.m_propList.length; i++) {
            let oc = this.m_propList[i];
            if (oc == prop) {
                return this.m_propList.splice(i, 1)[0];
            }
        }
    }

    public clear(): void {
        this.m_propList.length = 0;
    }

    public getPropList(): Array<Prop> {
        return this.m_propList;
    }

    public getPropByTile(position: cc.Vec2): Prop {
        for (let i = 0; i < this.m_propList.length; i++) {
            let prop: Prop = this.m_propList[i];
            let tilePos = prop.getTilePosition();
            if (tilePos.x == position.x && tilePos.y == position.y) {
                return prop;
            }
        }
    }
    public removeByTile(position: cc.Vec2): void {
        for (let i = 0; i < this.m_propList.length; i++) {
            let prop: Prop = this.m_propList[i];
            let tilePos = prop.getTilePosition();
            if (tilePos.x == position.x && tilePos.y == position.y) {
                this.m_propList.splice(i, 1);
            }
        }
    }
    public collide(playerRect: cc.Rect): Prop {
        for (let i = 0; i < this.m_propList.length; i++) {
            let prop: Prop = this.m_propList[i];
            let bombNodePosition = prop.getPropNode().getPosition();
            if (playerRect.contains(bombNodePosition)) {
                return prop;
            }
        }
        return null;
    }
}
