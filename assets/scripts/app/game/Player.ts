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

    async onLoad() {

        let spriteAtlas: cc.SpriteAtlas = await this.loaderSpriteFrame();
        let spriteRigthFrame = spriteAtlas.getSpriteFrame("man_standright0")
        let spriteLeftFrame = spriteAtlas.getSpriteFrame("man_standleft0")

        this.m_playerNode = new cc.Node("playerNode");
        this.m_playerNode.setScale(2.5);
        this.m_playerNode.zIndex = 10;



        let sprite = this.m_playerNode.addComponent(cc.Sprite);

        let rightAnimationClip: cc.AnimationClip = await this.loaderRes("game/animation/right");
        rightAnimationClip.wrapMode = cc.WrapMode.Loop;
        rightAnimationClip.speed = 2.5;


        let leftAnimationClip: cc.AnimationClip = await this.loaderRes("game/animation/left");
        leftAnimationClip.wrapMode = cc.WrapMode.Loop;
        leftAnimationClip.speed = 2.5;

        let upAnimationClip: cc.AnimationClip = await this.loaderRes("game/animation/up");
        upAnimationClip.wrapMode = cc.WrapMode.Loop;
        upAnimationClip.speed = 2.5;


        let downAnimationClip: cc.AnimationClip = await this.loaderRes("game/animation/down");
        downAnimationClip.wrapMode = cc.WrapMode.Loop;
        downAnimationClip.speed = 2.5;

        this.m_animation = this.m_playerNode.addComponent(cc.Animation);


        this.m_animation.addClip(rightAnimationClip);
        this.m_animation.addClip(leftAnimationClip);
        this.m_animation.addClip(upAnimationClip);
        this.m_animation.addClip(downAnimationClip);

        this.node.addChild(this.m_playerNode);

        this.m_playerNode.setPosition(this.m_postioin);

        sprite.spriteFrame = spriteRigthFrame;
        if (this.m_initSpriteDirection == 1) {
            sprite.spriteFrame = spriteLeftFrame;
        }
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
    public setMap(map): void {
        this.m_map = map;
        this.m_wallLayer = this.m_map.getLayer("wall");
        this.m_itemLayer = this.m_map.getLayer("item");
    }

    public setJoystick(joystick: Joystick): void {
        this.m_joystick = joystick;
    }

    public updatePlayerPosition(position: cc.Vec2): void {
        this.m_playerNode.setPosition(position);
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
        let tiled = this.getTilePosition(this.m_playerNode.getPosition());
        if (BombManager.getInstance().contain(tiled)) {
            return;
        }

        let playerPos = this.tiledConverToWorldPos(this.getTilePosition(this.m_playerNode.getPosition()))
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerBombPlaceS");
        let msg = msgObject.create({ x: playerPos.x, y: playerPos.y });
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
        let direction: cc.Vec2 = this.m_moveDirection;
        if (direction.x == 0 && direction.y == 0 && this.m_direction != DIRECTION.NONE) {
            this.m_animation.stop();
            this.m_direction = DIRECTION.NONE;
            this.sendSynPosition();
            return;
        }

        if (direction.y == 1 && this.m_direction != DIRECTION.UP) {
            this.m_direction = DIRECTION.UP;
            this.m_animation.play("up");
        }
        if (direction.y == -1 && this.m_direction != DIRECTION.DOWN) {
            this.m_direction = DIRECTION.DOWN;
            this.m_animation.play("down");
        }
        if (direction.x == -1 && this.m_direction != DIRECTION.LEFT) {
            this.m_direction = DIRECTION.LEFT;
            this.m_animation.play("left");
        }
        if (direction.x == 1 && this.m_direction != DIRECTION.RIGHT) {
            this.m_direction = DIRECTION.RIGHT;
            this.m_animation.play("right");
        }

        let nextPosition = this.m_playerNode.getPosition();
        let playerContentSize = cc.size(20, 20);
        if (this.m_direction == DIRECTION.LEFT) {
            nextPosition.x = nextPosition.x - this.m_playerSpeed - playerContentSize.width;
            nextPosition = this.getTilePosition(nextPosition);
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.x = this.m_playerNode.x - this.m_playerSpeed;
            }
        } else if (this.m_direction == DIRECTION.RIGHT) {
            nextPosition.x = nextPosition.x + this.m_playerSpeed + playerContentSize.width;
            nextPosition = this.getTilePosition(nextPosition);
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.x = this.m_playerNode.x + this.m_playerSpeed;
            }
        } else if (this.m_direction == DIRECTION.UP) {
            nextPosition.y = nextPosition.y + this.m_playerSpeed + playerContentSize.height;
            nextPosition = this.getTilePosition(nextPosition);
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.y = this.m_playerNode.y + this.m_playerSpeed;
            }

        } else if (this.m_direction == DIRECTION.DOWN) {
            nextPosition.y = nextPosition.y - this.m_playerSpeed - playerContentSize.height;
            nextPosition = this.getTilePosition(nextPosition);
            if (this.moveNext(nextPosition)) {
                this.m_playerNode.y = this.m_playerNode.y - this.m_playerSpeed;
            }
        }
    }

    /**
     * tiled map v2
     * @param nextPosition 
     */
    private moveNext(nextPosition: cc.Vec2): boolean {


        var mapSize = this.m_map.getMapSize();
        if (nextPosition.x < 0 || nextPosition.x >= mapSize.width) return false;
        if (nextPosition.y < 0 || nextPosition.y >= mapSize.height) return false;

        if (this.m_wallLayer.getTileGIDAt(nextPosition) || this.m_itemLayer.getTileGIDAt(nextPosition)) {
            return false;
        }

        let off = 19;
        let offMove = 15;
        let playerPos = this.m_playerNode.getPosition();

        if (this.m_direction == DIRECTION.DOWN) {

            let firstPos = cc.v2(nextPosition.x + 1, nextPosition.y);  // 右侧
            let firstPosition = this.tiledConverToWorldPos(firstPos);
            let firstRect = cc.rect(firstPosition.x - 20, firstPosition.y - 20, 40, 40);

            let secondPos = cc.v2(nextPosition.x - 1, nextPosition.y); // 左侧
            let secondPosition = this.tiledConverToWorldPos(secondPos);
            let secondRect = cc.rect(secondPosition.x - 20, secondPosition.y - 20, 40, 40);

            let leftBottom = cc.v2(playerPos.x - off, playerPos.y - off);
            let rightBottom = cc.v2(playerPos.x + off, playerPos.y - off);


            if (firstRect.contains(rightBottom) && this.m_itemLayer.getTileGIDAt(firstPos)) {
                let off = Math.abs(firstPosition.x - firstRect.width / 2 - rightBottom.x);
                if (off <= offMove) {
                    this.m_playerNode.x = this.m_playerNode.x - off;
                    return true;
                }
                return false;
            }

            if (secondRect.contains(leftBottom) && this.m_itemLayer.getTileGIDAt(secondPos)) {
                let off = Math.abs(secondPosition.x + secondRect.width / 2 - leftBottom.x);
                if (off <= offMove) {
                    this.m_playerNode.x = this.m_playerNode.x + off;
                    return true;
                }
                return false;
            }

        } else if (this.m_direction == DIRECTION.UP) {

            let firstPos = cc.v2(nextPosition.x + 1, nextPosition.y); // 右侧
            let firstPosition = this.tiledConverToWorldPos(firstPos);
            let firstRect = cc.rect(firstPosition.x - 20, firstPosition.y - 20, 40, 40);

            let secondPos = cc.v2(nextPosition.x - 1, nextPosition.y); //左侧
            let secondPosition = this.tiledConverToWorldPos(secondPos);
            let secondRect = cc.rect(secondPosition.x - 20, secondPosition.y - 20, 40, 40);

            let leftTop = cc.v2(playerPos.x - off, playerPos.y + off);
            let rightTop = cc.v2(playerPos.x + off, playerPos.y + off);

            if (firstRect.contains(rightTop) && this.m_itemLayer.getTileGIDAt(firstPos)) {
                let off = Math.abs(firstPosition.x - firstRect.width / 2 - rightTop.x);
                if (off <= offMove) {
                    this.m_playerNode.x = this.m_playerNode.x - off;
                    return true;
                }
                return false;
            }

            if (secondRect.contains(leftTop) && this.m_itemLayer.getTileGIDAt(secondPos)) {
                let off = Math.abs(secondPosition.x + secondRect.width / 2 - leftTop.x);
                if (off <= offMove) {
                    this.m_playerNode.x = this.m_playerNode.x + off;
                    return true;
                }
                return false;
            }
        } else if (this.m_direction == DIRECTION.LEFT) {

            let firstPos = cc.v2(nextPosition.x, nextPosition.y + 1); //下
            let firstPosition = this.tiledConverToWorldPos(firstPos);
            let firstRect = cc.rect(firstPosition.x - 20, firstPosition.y - 20, 40, 40);

            let secondPos = cc.v2(nextPosition.x, nextPosition.y - 1); //上
            let secondPosition = this.tiledConverToWorldPos(secondPos);
            let secondRect = cc.rect(secondPosition.x - 20, secondPosition.y - 20, 40, 40);

            let leftTop = cc.v2(playerPos.x - off, playerPos.y + off);
            let leftBottom = cc.v2(playerPos.x - off, playerPos.y - off);


            if (firstRect.contains(leftBottom) && this.m_itemLayer.getTileGIDAt(firstPos)) {
                let off = Math.abs(firstRect.height / 2 + firstPosition.y - leftBottom.y);
                if (off <= offMove) {
                    this.m_playerNode.y = this.m_playerNode.y + off;
                    return true;
                }
                return false;
            }

            if (secondRect.contains(leftTop) && this.m_itemLayer.getTileGIDAt(secondPos)) {
                let off = Math.abs(secondPosition.y - secondRect.height / 2 - leftTop.y);
                if (off <= offMove) {
                    this.m_playerNode.y = this.m_playerNode.y - off;
                    return true;
                }
                return false;
            }

        } else if (this.m_direction == DIRECTION.RIGHT) {

            let firstPos = cc.v2(nextPosition.x, nextPosition.y + 1); //下
            let firstPosition = this.tiledConverToWorldPos(firstPos);
            let firstRect = cc.rect(firstPosition.x - 20, firstPosition.y - 20, 40, 40);

            let secondPos = cc.v2(nextPosition.x, nextPosition.y - 1); //上
            let secondPosition = this.tiledConverToWorldPos(secondPos);
            let secondRect = cc.rect(secondPosition.x - 20, secondPosition.y - 20, 40, 40);

            let rightTop = cc.v2(playerPos.x + off, playerPos.y + off);
            let rightBottom = cc.v2(playerPos.x + off, playerPos.y - off);


            if (firstRect.contains(rightBottom) && this.m_itemLayer.getTileGIDAt(firstPos)) {
                let off = Math.abs(firstPosition.y + firstRect.height / 2 - rightBottom.y);
                if (off <= offMove) {
                    this.m_playerNode.y = this.m_playerNode.y + off;
                    return true;
                }
                return false;
            }

            if (secondRect.contains(rightTop) && this.m_itemLayer.getTileGIDAt(secondPos)) {
                let off = Math.abs(secondPosition.y - secondRect.height / 2 - rightTop.y);
                if (off <= offMove) {
                    this.m_playerNode.y = this.m_playerNode.y - off;
                    return true;
                }
                return false;
            }
        }

        if (BombManager.getInstance().collide(this.tiledConverToWorldPos(nextPosition))) {
            return false;
        }
        return true;
    }

    private tiledConverToWorldPos(pos: cc.Vec2): cc.Vec2 {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = pos.x * tileSize.width + 20;
        let y = (mapSize.height - pos.y) * tileSize.height - 20;
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
            cc.loader.loadRes("game/man", cc.SpriteAtlas, (error, res) => {
                if (error) {
                    reject(error);
                }
                resolve(res);
            })
        });
    }
}
