import Game from "./Game";
import CustomizeEvent from "../../event/CustomizeEvent";
import Bomb from "./Bomb";
import BombManager from "./BombManager";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";

const { ccclass, property } = cc._decorator;

enum DIRECTION {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3,
    NONE = 4,
}


@ccclass
export default class OtherPlayer extends cc.Component {

    private m_animation: cc.Animation = null;
    private m_direction: number = DIRECTION.NONE;

    private m_playerNode: cc.Node = null;
    private m_postioin: cc.Vec2 = null;
    private m_map: cc.TiledMap = null;
    private m_wallLayer: cc.TiledLayer = null;
    private m_itemLayer: cc.TiledLayer = null;

    private m_playerSpeed: number = 4;
    private m_moveDirection: cc.Vec2 = cc.v2(0, 0);


    private m_initSpriteDirection: number = 0;

    private m_playerId: number = 0;


    private m_sysArray: Array<cc.Vec2> = new Array();

    private m_roleSuffix: string = "yellow_"
    private m_frameName: string = "yellow_standright";
    private m_frameFileName: string = "game/role/yellow";

    onLoad() {

    }

    async start(): Promise<void>  {
        let spriteAtlas: cc.SpriteAtlas = await this.loaderSpriteFrame(this.m_frameFileName);
        let spriteRigthFrame = spriteAtlas.getSpriteFrame(this.m_frameName)

        this.m_playerNode = new cc.Node("playerNode");
        if(this.m_roleSuffix === "yellow_") {
            this.m_playerNode.scale = 0.8
        }
        this.m_playerNode.zIndex = 11;


        let sprite = this.m_playerNode.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteRigthFrame;
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

        if(this.m_initSpriteDirection == 1) {
            this.m_playerNode.scaleX = -1;
        }
    }
    public initSpriteDirection(spriteDirection): void {
        this.m_initSpriteDirection = spriteDirection;
    }

    public setPlayerId(id: number): void {
        this.m_playerId = id;
    }

    public getPlayerId(): number {
        return this.m_playerId;
    }

    public getPlayerPosition(): cc.Vec2 {
        return this.m_playerNode.getPosition();
    }
    
    public setPosition(pos: cc.Vec2): void {
        this.m_postioin = pos;
    }

    public setMap(map): void {
        this.m_map = map;
        this.m_wallLayer = this.m_map.getLayer("wall");
        this.m_itemLayer = this.m_map.getLayer("item");
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

    public setHelpAnimation() :void {
        this.m_direction = DIRECTION.NONE;
        this.m_animation.play(this.m_roleSuffix + "help");
        this.m_playerNode.scale = 0.7
    }


    public updatePlayerPosition(position: cc.Vec2): void {
        this.m_sysArray.push(position);
    }

    public putdownBomb(): void {
        let tiled = this.getTilePosition(this.m_playerNode.getPosition());
        if (BombManager.getInstance().contain(tiled)) {
            return;
        }

        
        let playerPos = this.tiledConverToWorldPos(tiled)
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerBombPlaceS");
        let msg = msgObject.create({ x: playerPos.x, y: playerPos.y });
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_S, msgEncode);
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }


    getTilePosition(posInPixel) {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let mapTatolHeight = tileSize.height * mapSize.height;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(((mapTatolHeight - posInPixel.y) / tileSize.height));
        return cc.v2(x, y);
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

        let direction: cc.Vec2 = this.m_moveDirection;
        if (direction.x == 0 && direction.y == 0 && this.m_direction != DIRECTION.NONE) {
            this.m_animation.stop();
            this.m_direction = DIRECTION.NONE;
            return;
        }

        if (direction.y == 1 && this.m_direction != DIRECTION.UP) {
            this.m_direction = DIRECTION.UP;
            this.m_animation.play(this.m_roleSuffix + "up");
        }
        if (direction.y == -1 && this.m_direction != DIRECTION.DOWN) {
            this.m_direction = DIRECTION.DOWN;
            this.m_animation.play(this.m_roleSuffix + "down");
        }
        if (direction.x == -1 && this.m_direction != DIRECTION.LEFT) {
            this.m_direction = DIRECTION.LEFT;
            this.m_animation.play(this.m_roleSuffix + "right");
            this.m_playerNode.scaleX = -1;
        }
        if (direction.x == 1 && this.m_direction != DIRECTION.RIGHT) {
            this.m_direction = DIRECTION.RIGHT;
            this.m_animation.play(this.m_roleSuffix + "right");
            this.m_playerNode.scaleX = 1;
        }

        if (this.m_sysArray.length > 0) {
            let p = this.m_sysArray.shift();
            this.m_playerNode.position = cc.v3(p);
        }
    }
    private tiledConverToWorldPos(pos: cc.Vec2): cc.Vec2 {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = pos.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - pos.y) * tileSize.height;
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
