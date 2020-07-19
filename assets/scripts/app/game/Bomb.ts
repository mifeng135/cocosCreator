import BombManager from "./BombManager";
import Player from "./Player";
import OtherPlayer from "./OtherPlayer";
import NetWebsocket from "../../manager/NetWebsocket";
import MsgUtil from "../../utils/MsgUtil";
import ProtoConstant from "../../constant/ProtoConstant";
import ProtoManager from "../../manager/ProtoManager";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import ResManager from "../../manager/ResManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {


    private m_animation: cc.Animation = null;
    private m_bombNode: cc.Node = null;
    private m_bombPos: cc.Vec2 = null;
    private m_bombTiledPos: cc.Vec2 = null;

    private m_checkCollide: boolean = false;

    private m_itemLayer: cc.TiledLayer = null;
    private m_wallLayer: cc.TiledLayer = null;
    private m_map: cc.TiledMap = null;


    private m_bombPower: number = 1;

    private m_removeTiledPath: Array<cc.Vec2> = new Array(); // 雷爆炸的时候 需要移除的item

    private m_bombSpriteAtlas: cc.SpriteAtlas = null;
    private m_bombSpriteNodeArray: Array<cc.Node> = new Array();


    private m_bombExplodeList: Array<Bomb> = new Array();
    private m_checkBombList: Array<Bomb> = new Array();
    private m_copyBombList: Array<Bomb> = new Array();


    private m_playerComponent: Player = null;
    private m_otherPlayer: OtherPlayer = null;
    private m_playerId: number = 0

    private m_index: number = 0;

    async onLoad() {

        this.m_bombSpriteAtlas = await this.loaderBombSpriteFrame();

        let spriteAtlas: cc.SpriteAtlas = await this.loaderSpriteFrame();
        let spriteFrame = spriteAtlas.getSpriteFrame("black_0")

        this.m_bombNode = new cc.Node("bombNode");
        this.m_bombNode.zIndex = 9;
        this.m_bombNode.scale = 1.5;

        let sprite = this.m_bombNode.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;


        let bombAnimationClip: cc.AnimationClip = await this.loaderRes("game/animation/bomb1");
        bombAnimationClip.wrapMode = cc.WrapMode.Loop;
        bombAnimationClip.speed = 0.8;

        this.m_animation = this.m_bombNode.addComponent(cc.Animation);
        this.m_animation.addClip(bombAnimationClip);


        this.node.addChild(this.m_bombNode);
        let animationState: cc.AnimationState = this.m_animation.play("bomb1");
        animationState.repeatCount = 3;

        this.m_animation.on("finished", this.onPlayEvent.bind(this), true);

        this.m_bombNode.setPosition(this.m_bombPos);
        BombManager.getInstance().add(this);
    }


    public onPlayEvent(event): void {
        BombManager.getInstance().remove(this);

        this.m_copyBombList = BombManager.getInstance().getBombList();
        this.m_bombExplodeList.length = 0;
        this.m_checkBombList.length = 0;

        this.m_checkBombList.push(this);
        this.m_bombExplodeList.push(this);


        this.caleExplodeBombList();
        this.removeBomb();
        this.findPath();
    }

    private removeBomb(): void {
        if (this.m_bombExplodeList.length > 0) {
            for (let i = 0; i < this.m_bombExplodeList.length; i++) {
                this.m_bombExplodeList[i].getBombNode().removeFromParent();
            }
        }
    }

    public setBombPosition(pos: cc.Vec2, tiledPos: cc.Vec2): void {
        this.m_bombPos = pos;
        this.m_bombTiledPos = tiledPos;
    }

    public setItemLayer(map: cc.TiledMap): void {
        this.m_map = map;
        this.m_wallLayer = this.m_map.getLayer("wall");
        this.m_itemLayer = this.m_map.getLayer("item");
    }

    public setPlayer(player: Player): void {
        this.m_playerComponent = player;
    }

    public setOtherPlayer(otherPlayer: OtherPlayer): void {
        this.m_otherPlayer = otherPlayer;
    }

    public setIndex(index: number): void {
        this.m_index = index;
    }

    public setPower(power: number): void {
        this.m_bombPower = power;
    }
    public setPlayerId(playerId: number): void {
        this.m_playerId = playerId;
    }

    public getPlayerId(): number {
        return this.m_playerId;
    }
    /**
     * 
     * 递归检测哪些雷要爆炸
     */
    private caleExplodeBombList() {
        if (this.m_checkBombList.length <= 0) {
            return;
        }

        let leftBreak = false;
        let rightBreak = false;
        let upBreak = false;
        let downBreak = false;

        let bomb: Bomb = this.m_checkBombList.shift();
        let bombTiledPos = bomb.getTiledPosition();

        for (let i = 1; i <= this.m_bombPower; i++) {
            let leftV = cc.v2(bombTiledPos.x - i, bombTiledPos.y);
            let rightV = cc.v2(bombTiledPos.x + i, bombTiledPos.y);

            let upV = cc.v2(bombTiledPos.x, bombTiledPos.y - i);
            let downV = cc.v2(bombTiledPos.x, bombTiledPos.y + i);


            let collideType = this.checkAroundBomb(leftV);

            if (collideType == 1 && !leftBreak) {
                let bomb = this.getBombByTiledPosition(leftV);
                this.m_bombExplodeList.push(bomb);
                this.m_checkBombList.push(bomb);
            } else if (collideType == -1) {
                leftBreak = true;
            }


            collideType = this.checkAroundBomb(rightV);
            if (collideType == 1 && !rightBreak) {
                let bomb: Bomb = this.getBombByTiledPosition(rightV);
                this.m_bombExplodeList.push(bomb);
                this.m_checkBombList.push(bomb);
            } else if (collideType == -1) {
                rightBreak = true;
            }


            collideType = this.checkAroundBomb(upV);
            if (collideType == 1 && !upBreak) {
                let bomb = this.getBombByTiledPosition(upV);
                this.m_bombExplodeList.push(bomb);
                this.m_checkBombList.push(bomb);
            } else if (collideType == -1) {
                upBreak = true;
            }

            collideType = this.checkAroundBomb(downV);
            if (collideType == 1 && !downBreak) {
                let bomb = this.getBombByTiledPosition(downV);
                this.m_bombExplodeList.push(bomb);
                this.m_checkBombList.push(bomb);
            } else if (collideType == -1) {
                downBreak = true;
            }
        }

        this.caleExplodeBombList();
    }

    /**
     * 检测碰撞体类型
     * @param position 
     */
    private checkAroundBomb(position): number {
        var mapSize = this.m_map.getMapSize();
        if (position.x < 0 || position.x >= mapSize.width) return -1;
        if (position.y < 0 || position.y >= mapSize.height) return -1;

        if (this.m_itemLayer.getTileGIDAt(position)) {
            return -1;
        }

        if (this.m_wallLayer.getTileGIDAt(position)) {
            return -1;
        }

        if (this.getHaveBomb(position)) {
            return 1;
        }
        return 0;
    }

    private getBombByTiledPosition(tiledPosition: cc.Vec2): Bomb {
        for (let i = 0; i < this.m_copyBombList.length; i++) {
            let bomb: Bomb = this.m_copyBombList[i];
            let bombTiledPos = bomb.getTiledPosition();
            if (bombTiledPos.x == tiledPosition.x && bombTiledPos.y == tiledPosition.y) {
                return this.m_copyBombList.splice(i, 1)[0];
            }
        }
        return null;
    }

    private getHaveBomb(tiledPosition: cc.Vec2): boolean {
        for (let i = 0; i < this.m_copyBombList.length; i++) {
            let bomb: Bomb = this.m_copyBombList[i];
            let bombTiledPos = bomb.getTiledPosition();
            if (bombTiledPos.x == tiledPosition.x && bombTiledPos.y == tiledPosition.y) {
                return true;
            }
        }
        return false;
    }

    /*****检测要爆炸的雷结束 */



    /**
     * 检测可以爆炸的路径精灵
     */
    private findPath() {
        this.m_removeTiledPath.length = 0;
        this.m_bombSpriteNodeArray.length = 0;

        let bombPath: Array<any> = new Array();

        for (let index = 0; index < this.m_bombExplodeList.length; index++) {
            let bomb: Bomb = this.m_bombExplodeList[index];
            let bombTiledPos = bomb.getTiledPosition();

            let leftBreak = false;
            let rightBreak = false;
            let upBreak = false;
            let downBreak = false;


            let oneBombPath = {}
            oneBombPath["left"] = new Array();
            oneBombPath["right"] = new Array();
            oneBombPath["up"] = new Array();
            oneBombPath["down"] = new Array();


            for (let i = 1; i <= this.m_bombPower; i++) {

                let leftV = cc.v2(bombTiledPos.x - i, bombTiledPos.y);
                let rightV = cc.v2(bombTiledPos.x + i, bombTiledPos.y);

                let upV = cc.v2(bombTiledPos.x, bombTiledPos.y - i);
                let downV = cc.v2(bombTiledPos.x, bombTiledPos.y + i);

                if (this.checkAround(leftV, leftBreak) && !leftBreak) {
                    oneBombPath["left"].push(leftV);
                } else {
                    leftBreak = true;
                }

                if (this.checkAround(rightV, rightBreak) && !rightBreak) {
                    oneBombPath["right"].push(rightV);
                } else {
                    rightBreak = true;
                }

                if (this.checkAround(upV, upBreak) && !upBreak) {
                    oneBombPath["up"].push(upV);
                } else {
                    upBreak = true;
                }

                if (this.checkAround(downV, downBreak) && !downBreak) {
                    oneBombPath["down"].push(downV);
                } else {
                    downBreak = true;
                }
            }
            bombPath.push(oneBombPath);
        }

        this.createBombSprite(bombPath);
    }

    private checkAround(nextPosition, flag) {
        var mapSize = this.m_map.getMapSize();
        if (nextPosition.x < 0 || nextPosition.x >= mapSize.width) return false;
        if (nextPosition.y < 0 || nextPosition.y >= mapSize.height) return false;

        if (this.m_itemLayer.getTileGIDAt(nextPosition)) {
            if (!flag) {
                this.m_removeTiledPath.push(nextPosition);
            }
            return false;
        }

        if (this.m_wallLayer.getTileGIDAt(nextPosition)) {
            return false;
        }
        return true;
    }

    /**检测可以爆炸的路径精灵 结束 */



    public getBombNode(): cc.Node {
        return this.m_bombNode;
    }

    public getCheckCollide(): boolean {
        return this.m_checkCollide;
    }

    public setCheckCollied(value: boolean): void {
        this.m_checkCollide = value;
    }

    public getTiledPosition(): cc.Vec2 {
        return this.m_bombTiledPos;
    }

    public createBombSprite(bombPath): void {


        this.createSpriteBomb(this.m_bombTiledPos, "center", 0);

        for (let i = 0; i < bombPath.length; i++) {
            let oneBombPath = bombPath[i];

            let leftPath = oneBombPath["left"];
            let rightPath = oneBombPath["right"];
            let upPath = oneBombPath["up"];
            let downPath = oneBombPath["down"];



            for (let i = 0; i < leftPath.length; i++) {
                let position = leftPath[i];
                if (i == leftPath.length - 1) {
                    this.createSpriteBomb(position, "left_end", i);
                } else {
                    this.createSpriteBomb(position, "left", i);
                }
            }

            for (let i = 0; i < rightPath.length; i++) {
                let position = rightPath[i];
                if (i == rightPath.length - 1) {
                    this.createSpriteBomb(position, "right_end", i);
                } else {
                    this.createSpriteBomb(position, "right", i);
                }
            }

            for (let i = 0; i < upPath.length; i++) {
                let position = upPath[i];
                if (i == upPath.length - 1) {
                    this.createSpriteBomb(position, "up_end", i);
                } else {
                    this.createSpriteBomb(position, "up", i);
                }
            }

            for (let i = 0; i < downPath.length; i++) {
                let position = downPath[i];
                if (i == downPath.length - 1) {
                    this.createSpriteBomb(position, "down_end", i);
                } else {
                    this.createSpriteBomb(position, "down", i);
                }
            }
        }

        this.scheduleOnce(this.remveTiled.bind(this), 0.08 * this.m_bombPower)

        this.scheduleOnce(this.clearBombSpriteArray.bind(this), 0.5)

        this.checkBombCheck(bombPath);
    }

    private remveTiled() {
        for (let i = 0; i < this.m_removeTiledPath.length; i++) {
            let position = this.m_removeTiledPath[i];
            this.m_itemLayer.setTileGIDAt(0, position, 0);
            this.m_playerComponent.removeItemBox(position);
        }
    }

    private createSpriteBomb(position: cc.Vec2, spirteFrame: string, index: number): void {
        let worldPosition = this.tiledTranlateToWorldPos(position);
        let bomeSpriteNode = new cc.Node("bomeSprite");
        let sprite = bomeSpriteNode.addComponent(cc.Sprite);
        sprite.spriteFrame = this.m_bombSpriteAtlas.getSpriteFrame(spirteFrame);
        bomeSpriteNode.setPosition(worldPosition);
        this.m_bombSpriteNodeArray.push(bomeSpriteNode);
        this.node.addChild(bomeSpriteNode);
    }

    private clearBombSpriteArray(): void {
        if (this.m_bombSpriteNodeArray.length > 0) {
            for (let i = 0; i < this.m_bombSpriteNodeArray.length; i++) {
                let bombSpriteNode = this.m_bombSpriteNodeArray[i];
                bombSpriteNode.removeFromParent();
            }
        }
    }


    private checkBombCheck(bombPath): void {

        let explodePath: Array<cc.Vec2> = new Array();

        explodePath.push(cc.v2(this.m_bombTiledPos.x, this.m_bombTiledPos.y));


        for (let index = 0; index < bombPath.length; index++) {
            let oneBombPath = bombPath[index];
            let leftPath = oneBombPath["left"];
            let rightPath = oneBombPath["right"];
            let upPath = oneBombPath["up"];
            let downPath = oneBombPath["down"];

            for (let i = 0; i < leftPath.length; i++) {
                let pos = leftPath[i];
                explodePath.push(pos);
            }

            for (let i = 0; i < rightPath.length; i++) {
                let pos = rightPath[i];
                explodePath.push(pos);
            }

            for (let i = 0; i < upPath.length; i++) {
                let pos = upPath[i];
                explodePath.push(pos);
            }

            for (let i = 0; i < downPath.length; i++) {
                let pos = downPath[i];
                explodePath.push(pos);
            }
        }

        if (this.m_index == 0) {
            let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "bombExplodeS");
            let msg = msgObject.create({ explodePath: explodePath });
            let msgEncode = msgObject.encode(msg).finish();
            let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_BOMB_EXPLODE_S, msgEncode);
            NetWebsocket.getInstance().sendMsg(sendBuf);

            if (this.m_removeTiledPath.length > 0) {
                let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "createPropS");
                let msg = msgObject.create({ removePath: this.m_removeTiledPath });
                let msgEncode = msgObject.encode(msg).finish();
                let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_CREATE_PROP_S, msgEncode);
                NetWebsocket.getInstance().sendMsg(sendBuf);
            }
        }
    }

    private getTilePosition(posInPixel) {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let mapTatolHeight = tileSize.height * mapSize.height;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(((mapTatolHeight - posInPixel.y) / tileSize.height));
        return cc.v2(x, y);
    }

    private tiledTranlateToWorldPos(pos: cc.Vec2): cc.Vec2 {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = pos.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - pos.y) * tileSize.height - tileSize.height / 2;
        return cc.v2(x, y);
    }

    public loaderRes(animationName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cc.loader.loadRes(animationName, cc.AnimationClip, (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res);
            })
        });
    }



    public loaderSpriteFrame(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cc.loader.loadRes("game/bomb", cc.SpriteAtlas, (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res);
            })
        });
    }

    public loaderBombSpriteFrame(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cc.loader.loadRes("game/bombSprite", cc.SpriteAtlas, (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res);
            })
        });
    }
}
