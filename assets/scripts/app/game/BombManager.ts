import Bomb from "./Bomb";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BombManager {


    private m_bombList: Array<Bomb> = new Array();
    private static m_instance: BombManager = null;

    private constructor() { }

    public static getInstance(): BombManager {
        if (this.m_instance == null) {
            this.m_instance = new BombManager();
        }
        return this.m_instance;
    }

    public add(bomb: Bomb): void {
        this.m_bombList.push(bomb);
    }

    public remove(bomb: Bomb): Bomb {
        for (let i = 0; i < this.m_bombList.length; i++) {
            let oc = this.m_bombList[i];
            if (oc == bomb) {
                return this.m_bombList.splice(i, 1)[0];
            }
        }
    }

    public getBombList(): Array<Bomb> {
        return this.m_bombList;
    }

    public contain(tiledPosition: cc.Vec2): boolean {
        for (let i = 0; i < this.m_bombList.length; i++) {
            let bomb: Bomb = this.m_bombList[i];
            let bombTiledPos = bomb.getTiledPosition();
            if (bombTiledPos.x == tiledPosition.x && bombTiledPos.y == tiledPosition.y) {
                return true;
            }
        }
        return false;
    }

    public getBombByTiledPosition(tiledPosition): Bomb {
        for (let i = 0; i < this.m_bombList.length; i++) {
            let bomb: Bomb = this.m_bombList[i];
            let bombTiledPos = bomb.getTiledPosition();
            if (bombTiledPos.x == tiledPosition.x && bombTiledPos.y == tiledPosition.y) {
                return bomb;
            }
        }
        return null;
    }
    public collide(pos: cc.Vec2): boolean {
        for (let i = 0; i < this.m_bombList.length; i++) {
            let bomb: Bomb = this.m_bombList[i];
            let bombNodePosition = bomb.getBombNode().getPosition();
            let checkCollide = bomb.getCheckCollide();
            let rect = cc.rect(bombNodePosition.x, bombNodePosition.y, 20, 20);
            let playerRect = cc.rect(pos.x, pos.y, 20, 20);
            if (cc.Intersection.rectRect(rect, playerRect) && checkCollide) {
                return true;
            }
            if (!cc.Intersection.rectRect(rect, playerRect)) {
                bomb.setCheckCollied(true);
            }
        }
        return false;
    }

}
