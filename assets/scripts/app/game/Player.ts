import Game from "./Game";
import CustomizeEvent from "../../event/CustomizeEvent";
import Bomb from "./Bomb";
import BombManager from "./BombManager";
import Joystick from "../../commonUI/Joystick";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import MsgUtil from "../../utils/MsgUtil";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import NetWebsocket from "../../manager/NetWebsocket";
import PropManager from "./PropManager";
import Prop from "./Prop";

const { ccclass, property } = cc._decorator;

enum DIRECTION {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3,
    NONE = 4,
}


@ccclass
export default class Player extends cc.Component {

    private m_animation: cc.Animation = null;
    private m_direction: number = DIRECTION.NONE;

    private m_playerNode: cc.Node = null;
    private m_postioin: cc.Vec2 = null;
    private m_map: cc.TiledMap = null;
    private m_wallLayer: cc.TiledLayer = null;
    private m_itemLayer: cc.TiledLayer = null;

    private m_playerSpeed: number = 4;
    private m_joystick: Joystick = null;

    private m_initSpriteDirection: number = 0;

    private m_moveDirection: cc.Vec2 = cc.v2(0, 0);

    private m_playerId: number = 0;

    private m_drawNode: cc.Graphics = null;

    private m_playerDrawNode: cc.Graphics = null;


    private m_itemBox: Array<cc.Rect> = new Array();

    private m_roleSuffix: string = ""
    private m_frameName: string = "red_standright";
    private m_frameFileName: string = "game/role/red";

    private m_stop: boolean = false;

    private m_bombPower: number = 1;

    private m_bombMaxCount:number = 1;

    onLoad() {

    }


    async start(): Promise<void> {
        let spriteAtlas: cc.SpriteAtlas = await this.loaderSpriteFrame(this.m_frameFileName);
        let spriteRigthFrame = spriteAtlas.getSpriteFrame(this.m_frameName);

        this.m_playerNode = new cc.Node("playerNode");
        if (this.m_roleSuffix === "yellow_") {
            this.m_playerNode.scale = 0.8
        }
        this.m_playerNode.zIndex = 10;

        let sprite = this.m_playerNode.addComponent(cc.Sprite);

        let rightAnimationClip: cc.AnimationClip = await this.loaderRes("game/role/animation/" + this.m_roleSuffix + "right");
        rightAnimationClip.wrapMode = cc.WrapMode.Loop;


        let upAnimationClip: cc.AnimationClip = await this.loaderRes("game/role/animation/" + this.m_roleSuffix + "up");
        upAnimationClip.wrapMode = cc.WrapMode.Loop;


        let downAnimationClip: cc.AnimationClip = await this.loaderRes("game/role/animation/" + this.m_roleSuffix + "down");
        downAnimationClip.wrapMode = cc.WrapMode.Loop;


        let helpAnimationClip: cc.AnimationClip = await this.loaderRes("game/role/animation/" + this.m_roleSuffix + "help");
        helpAnimationClip.wrapMode = cc.WrapMode.Loop;

        this.m_animation = this.m_playerNode.addComponent(cc.Animation);


        this.m_animation.addClip(rightAnimationClip);
        this.m_animation.addClip(upAnimationClip);
        this.m_animation.addClip(downAnimationClip);
        this.m_animation.addClip(helpAnimationClip);

        this.node.addChild(this.m_playerNode);

        this.m_playerNode.setPosition(this.m_postioin);

        sprite.spriteFrame = spriteRigthFrame;
        if (this.m_initSpriteDirection == 1) {
            this.m_playerNode.scaleX = -1;
        }
    }

    public setDrawNode(nodeDraw): void {
        this.m_drawNode = nodeDraw
    }

    public setPlayerDrawNode(playerDraw): void {
        this.m_playerDrawNode = playerDraw
    }

    public getPlayerPosition(): cc.Vec2 {
        return this.m_playerNode.getPosition();
    }
    private sendSynPosition(): void {
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerSynPositionS");
        let msg = msgObject.create({ x: this.m_playerNode.x, y: this.m_playerNode.y, direction: this.m_direction });
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_PLAYER_SYN_POSITION_S, msgEncode);
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }
    public setPlayerId(id: number): void {
        this.m_playerId = id;
    }

    public getPlayerId(): number {
        return this.m_playerId;
    }
    public setPosition(pos: cc.Vec2): void {
        this.m_postioin = pos;
    }

    public initSpriteDirection(spriteDirection): void {
        this.m_initSpriteDirection = spriteDirection;
    }

    public setRoleImageType(type: number): void {
        if (type == 1) {
            this.m_roleSuffix = "yellow_";
            this.m_frameFileName = "game/role/yellow";
            this.m_frameName = "yellow_standright";
        } else {
            this.m_roleSuffix = "";
            this.m_frameName = "red_standright";
            this.m_frameFileName = "game/role/red";
        }
    }

    public setHelpAnimation(): void {
        this.m_stop = true;
        this.m_direction = DIRECTION.NONE;
        this.m_animation.play(this.m_roleSuffix + "help");
        this.m_playerNode.scale = 0.7
    }

    public setPower(power: number): void {
        this.m_bombPower = power;
    }

    public getPower(): number {
        return this.m_bombPower;
    }

    public setMap(map): void {
        this.m_map = map;
        this.m_wallLayer = this.m_map.getLayer("wall");
        this.m_itemLayer = this.m_map.getLayer("item");


        let mapSize = this.m_map.getMapSize();
        let tiledSize = this.m_map.getTileSize();
        //this.m_drawNode.clear();



        for (let i = 0; i < mapSize.height; i++) {
            let worldPos = this.tiledConverToWorldPos(cc.v2(-1, i));
            let box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
            //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
            this.m_itemBox.push(box);

            worldPos = this.tiledConverToWorldPos(cc.v2(mapSize.width, i));
            box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
            //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
            this.m_itemBox.push(box);
        }


        for (let i = 0; i < mapSize.width; i++) {
            let worldPos = this.tiledConverToWorldPos(cc.v2(i, 0));
            let box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
            //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
            this.m_itemBox.push(box);

            worldPos = this.tiledConverToWorldPos(cc.v2(i, mapSize.height));
            box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
            //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
            this.m_itemBox.push(box);
        }

        for (let i = 0; i < mapSize.width; i++) {
            for (let j = 0; j < mapSize.height; j++) {
                let pos = cc.v2(i, j);
                if (this.m_wallLayer.getTileGIDAt(pos)) {
                    let worldPos = this.tiledConverToWorldPos(pos);
                    let box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
                    //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
                    this.m_itemBox.push(box)
                }




                if (this.m_itemLayer.getTileGIDAt(pos)) {
                    let worldPos = this.tiledConverToWorldPos(pos);
                    let box = cc.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height)
                    //this.m_drawNode.rect(worldPos.x - tiledSize.width / 2, worldPos.y - tiledSize.height, tiledSize.width, tiledSize.height);
                    this.m_itemBox.push(box)
                }
            }
        }

        //this.m_drawNode.fill();
    }

    public setJoystick(joystick: Joystick): void {
        this.m_joystick = joystick;
    }

    public updatePlayerPosition(position: cc.Vec2): void {
        this.m_playerNode.position = cc.v3(position);
    }

    getTilePosition(posInPixel) {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let mapTatolHeight = tileSize.height * mapSize.height;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(((mapTatolHeight - posInPixel.y) / tileSize.height));
        return cc.v2(x, y);
    }

    public putdownBomb(): void {

        let bombCount = BombManager.getInstance().getPlayerBombCount(this.m_playerId);
        if(bombCount >= this.m_bombMaxCount) {
            return;
        }

        let tiled = this.getTilePosition(this.m_playerNode.getPosition());
        if (BombManager.getInstance().contain(tiled)) {
            return;
        }


        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = tiled.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - tiled.y) * tileSize.height - tileSize.height / 2;

        let playerPos = cc.v2(x, y)
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerBombPlaceS");
        let msg = msgObject.create({ x: playerPos.x, y: playerPos.y, power: this.m_bombPower, playerId: this.m_playerId });
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_S, msgEncode);
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    public updateMoveDirection(direction: number): void {
        if (direction == DIRECTION.LEFT) {
            this.m_moveDirection = cc.v2(-1, 0);
        } else if (direction == DIRECTION.RIGHT) {
            this.m_moveDirection = cc.v2(1, 0);
        } else if (direction == DIRECTION.UP) {
            this.m_moveDirection = cc.v2(0, 1);
        } else if (direction == DIRECTION.DOWN) {
            this.m_moveDirection = cc.v2(0, -1);
        } else if (direction == DIRECTION.NONE) {
            this.m_moveDirection = cc.v2(0, 0);
        }
    }

    protected update(dt) {
        if (this.m_animation == null) {
            return;
        }

        if (this.m_stop) {
            return;
        }
        this.updatePlayerDirection();
        let nextPosition = this.m_playerNode.getPosition();
        if (this.m_direction == DIRECTION.LEFT) {
            nextPosition.x = nextPosition.x - this.m_playerSpeed;
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.x = this.m_playerNode.x - this.m_playerSpeed;
                this.sendSynPosition()
            }
        } else if (this.m_direction == DIRECTION.RIGHT) {
            nextPosition.x = nextPosition.x + this.m_playerSpeed;
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.x = this.m_playerNode.x + this.m_playerSpeed;
                this.sendSynPosition()
            }
        } else if (this.m_direction == DIRECTION.UP) {
            nextPosition.y = nextPosition.y + this.m_playerSpeed;
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.y = this.m_playerNode.y + this.m_playerSpeed;
                this.sendSynPosition()
            }

        } else if (this.m_direction == DIRECTION.DOWN) {
            nextPosition.y = nextPosition.y - this.m_playerSpeed;
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.y = this.m_playerNode.y - this.m_playerSpeed;
                this.sendSynPosition()
            }
        }
    }


    private updatePlayerDirection(): void {
        let direction: cc.Vec2 = this.m_joystick.getDirection();
        if (direction.x == 0 && direction.y == 0 && this.m_direction != DIRECTION.NONE) {
            this.adjustPosition();
            this.m_animation.stop();
            this.m_direction = DIRECTION.NONE;
            this.sendSynPosition();
            return;
        }

        if (direction.y == 1 && this.m_direction != DIRECTION.UP) {
            this.adjustPosition();
            this.m_direction = DIRECTION.UP;
            this.m_animation.play(this.m_roleSuffix + "up");
        }
        if (direction.y == -1 && this.m_direction != DIRECTION.DOWN) {
            this.adjustPosition();
            this.m_direction = DIRECTION.DOWN;
            this.m_animation.play(this.m_roleSuffix + "down");
        }
        if (direction.x == -1 && this.m_direction != DIRECTION.LEFT) {
            this.adjustPosition();
            this.m_direction = DIRECTION.LEFT;
            this.m_animation.play(this.m_roleSuffix + "right");
            this.m_playerNode.scaleX = -1;
        }
        if (direction.x == 1 && this.m_direction != DIRECTION.RIGHT) {
            this.adjustPosition();
            this.m_direction = DIRECTION.RIGHT;
            this.m_animation.play(this.m_roleSuffix + "right");
            this.m_playerNode.scaleX = 1;
        }
    }


    /**
     * 调整位置放置 碰撞检测用
     * @param direction 
     */
    private adjustPosition(): void {
        if (this.m_direction == DIRECTION.UP) {
            this.m_playerNode.y = this.m_playerNode.y - this.m_playerSpeed
        } else if (this.m_direction == DIRECTION.DOWN) {
            this.m_playerNode.y = this.m_playerNode.y + this.m_playerSpeed
        } else if (this.m_direction == DIRECTION.LEFT) {
            this.m_playerNode.x = this.m_playerNode.x + this.m_playerSpeed
        } else if (this.m_direction == DIRECTION.RIGHT) {
            this.m_playerNode.x = this.m_playerNode.x - this.m_playerSpeed
        }
    }

    /**
     * player next v2
     * @param nextPosition 
     */
    private moveNext(nextPosition: cc.Vec2): boolean {

        let titedPosition = this.getTilePosition(nextPosition);


        var mapSize = this.m_map.getMapSize();
        if (titedPosition.x < 0 || titedPosition.x >= mapSize.width) return false;
        if (titedPosition.y < 1 || titedPosition.y >= mapSize.height) return false;


        let playerPos = nextPosition;
        let playerContent = cc.size(65, 85);
        let playerBox = cc.rect(playerPos.x - playerContent.width / 2 + 10, playerPos.y - playerContent.height / 2 + 5, playerContent.width * 0.7, playerContent.height * 0.5);


        // this.m_playerDrawNode.clear();
        // this.m_playerDrawNode.rect(playerPos.x - playerContent.width / 2 + 10, playerPos.y - playerContent.height / 2 + 5, playerContent.width * 0.7, playerContent.height * 0.5);
        // this.m_playerDrawNode.fill();


        let intersectsArray: Array<any> = new Array();

        for (let i = 0; i < this.m_itemBox.length; i++) {
            let itemBox = this.m_itemBox[i];
            if (itemBox.intersects(playerBox)) {
                let outBox = this.intersection(itemBox, playerBox);
                let intersectionData = {}
                intersectionData["outBox"] = outBox;
                intersectionData["itemBox"] = itemBox;
                intersectsArray.push(intersectionData);
            }
        }

        if (intersectsArray.length > 1) {
            console.log("有两个碰撞体");
            return false;
        }

        if (intersectsArray.length == 1) {
            let intersectionData = intersectsArray[0];
            let outBox = intersectionData["outBox"];
            let itemBox = intersectionData["itemBox"]
            if (outBox.width > playerBox.width / 2 || outBox.height > playerBox.height / 2) { //如果碰撞超过人物大小的一半 则 默认过不去
                return false;
            }
            return this.forceMoveDirection(itemBox, playerBox, outBox);
        }

        if (BombManager.getInstance().collide(playerBox)) {
            return false;
        }

        let prop: Prop = PropManager.getInstance().collide(playerBox);
        if (prop) {
            let type = prop.getType();
            if (type == 0) {
                if (this.m_bombPower < 6) {
                    this.m_bombPower = this.m_bombPower + 1;
                }
            } else if (type == 1) {
                this.m_bombMaxCount = this.m_bombMaxCount + 1;
            } else {
                this.m_playerSpeed = 5;
            }


            let tilePos = prop.getTilePosition();
            let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "triggerPropS");
            let msg = msgObject.create({ x: tilePos.x, y: tilePos.y, });
            let msgEncode = msgObject.encode(msg).finish();
            let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_TRIGGER_PROP_S, msgEncode);
            NetWebsocket.getInstance().sendMsg(sendBuf);

            PropManager.getInstance().remove(prop);
            prop.getPropNode().removeFromParent();
        }
        return true;
    }

    private intersection(rectB, rectA): cc.Rect {
        var axMin = rectA.x, ayMin = rectA.y, axMax = rectA.x + rectA.width, ayMax = rectA.y + rectA.height;
        var bxMin = rectB.x, byMin = rectB.y, bxMax = rectB.x + rectB.width, byMax = rectB.y + rectB.height;
        let out = cc.rect(0, 0, 0, 0);
        out.x = Math.max(axMin, bxMin);
        out.y = Math.max(ayMin, byMin);
        out.width = Math.min(axMax, bxMax) - out.x;
        out.height = Math.min(ayMax, byMax) - out.y;
        return out;
    };

    private forceMoveDirection(itemBox: cc.Rect, playerBox: cc.Rect, outBox: cc.Rect): boolean {

        if (this.m_direction == DIRECTION.UP || this.m_direction == DIRECTION.DOWN) {
            if (outBox.width > 0 && outBox.width < 20) { //上下走的时候碰撞了 15 是否阈值
                if (itemBox.x > playerBox.x) { //碰撞体在人物的右侧
                    this.m_playerNode.x = this.m_playerNode.x - outBox.width - 6;
                } else {//碰撞体在人物的左侧
                    this.m_playerNode.x = this.m_playerNode.x + outBox.width + 6;
                }
                return true;
            }
        }

        if (this.m_direction == DIRECTION.LEFT || this.m_direction == DIRECTION.RIGHT) {
            if (outBox.height > 0 && outBox.height < 20) { // 左右走的时候碰撞了
                if (itemBox.y > playerBox.y) { //碰撞体在人物的上面
                    this.m_playerNode.y = this.m_playerNode.y - outBox.height - 10;
                } else {//碰撞体在人物的下面
                    this.m_playerNode.y = this.m_playerNode.y + outBox.height + 10;
                }
                return true;
            }
        }

        return false;
    }
    private tiledConverToWorldPos(pos: cc.Vec2): cc.Vec2 {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = pos.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - pos.y) * tileSize.height;
        return cc.v2(x, y);
    }


    public removeItemBox(tiledPos: cc.Vec2): void {
        let worldPos = this.tiledConverToWorldPos(tiledPos);
        let tiledSize = this.m_map.getTileSize();
        for (let i = 0; i < this.m_itemBox.length; i++) {
            let rect = this.m_itemBox[i]
            if (rect.x == worldPos.x - tiledSize.width / 2 && rect.y == worldPos.y - tiledSize.height) {
                this.m_itemBox.splice(i, 1);
                break;
            }
        }
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

    public loaderSpriteFrame(name: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cc.loader.loadRes(name, cc.SpriteAtlas, (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res);
            })
        });
    }
}
