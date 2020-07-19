import Player from "./Player";
import CustomizeEvent from "../../event/CustomizeEvent";
import Joystick from "../../commonUI/Joystick";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import OtherPlayer from "./OtherPlayer";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";
import LocalDataManager from "../../manager/LocalDataManager";
import Bomb from "./Bomb";
import UIManager from "../../manager/UIManager";
import ResManager from "../../manager/ResManager";
import Prop from "./Prop";
import PropManager from "./PropManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    m_map: cc.TiledMap = null;


    @property(cc.Node)
    m_joystick = null;


    @property(cc.Graphics)
    m_graphics = null;


    @property(cc.Graphics)
    m_playerGraphics = null;

    private m_player: Player = null;
    private m_playerPosition0 = null; //左上角

    private m_otherPlayer: OtherPlayer = null;
    private m_playerPosition1: any = null; //右下角


    private m_roomPlayerList: Array<any> = new Array();

    private m_gameStart: boolean = false;


    onLoad() {
        this.init();
        this.addEventListener();
    }

    onDestroy() {
        this.removeEventListener();
    }
    private init(): void {

        let resMapName = LocalDataManager.getInstance().getGameMapResName();
        let resData = ResManager.getInstance().getPermanentdByName(resMapName);
        this.m_map.tmxAsset = resData;

        let players = this.m_map.getObjectGroup("players");
        this.m_playerPosition0 = players.getObject("player1");
        this.m_playerPosition1 = players.getObject("player2");


        let layer = this.m_map.getLayer("fg");
        layer.node.zIndex = 20;

        PropManager.getInstance().clear();
    }

    public addEventListener(): void {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_R, this.onMsgRecvPlayerBombPlace, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_PLAYER_SYN_POSITION_R, this.onMsgRecvSynPosition, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_OVER_R, this.onMsgRecvGameOver, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_BOMB_EXPLODE_R, this.onMsgRecvBombExplode, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_PROP_R, this.onMsgRecvCreateProp, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_TRIGGER_PROP_R, this.onMsgRecvTriggerProp, this);
    }

    private removeEventListener(): void {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_R, this.onMsgRecvPlayerBombPlace);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_PLAYER_SYN_POSITION_R, this.onMsgRecvSynPosition);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_OVER_R, this.onMsgRecvGameOver);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_BOMB_EXPLODE_R, this.onMsgRecvBombExplode);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_PROP_R, this.onMsgRecvCreateProp);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_TRIGGER_PROP_R, this.onMsgRecvTriggerProp);
    }

    onMsgRecvOtherJoinRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "roomPlayerListR");
        let msg = msgOC.decode(data);
        this.m_roomPlayerList = msg.playerList
    }

    public addSelfPlayer(direction, position, playerId, roleType): void {
        this.m_player = this.m_map.addComponent(Player);
        this.m_player.setRoleImageType(roleType);
        this.m_player.setDrawNode(this.m_graphics)
        this.m_player.setPlayerDrawNode(this.m_playerGraphics)
        this.m_player.setPosition(position);
        this.m_player.setMap(this.m_map);
        this.m_player.setPlayerId(playerId);
        this.m_player.setJoystick(this.m_joystick.getComponent(Joystick));
        this.m_player.initSpriteDirection(direction);
    }

    public addOtherPlayer(direction, position, playerId, roleType): void {
        this.m_otherPlayer = this.m_map.addComponent(OtherPlayer);
        this.m_otherPlayer.setRoleImageType(roleType);
        this.m_otherPlayer.setPosition(position);
        this.m_otherPlayer.setMap(this.m_map);
        this.m_otherPlayer.setPlayerId(playerId);
        this.m_otherPlayer.initSpriteDirection(direction);
    }

    onMsgRecvGameStart(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "gameStartR");
        let msg = msgOC.decode(data);
        this.m_roomPlayerList = msg.playerList
        this.initPlayer();
    }

    private initPlayer(): void {
        let playerId = LocalDataManager.getInstance().getPlayerId();
        let otherPlayerId = 0;
        for (let i = 0; i < this.m_roomPlayerList.length; i++) {
            let data = this.m_roomPlayerList[i];
            if (data.id == playerId) {
                continue;
            }
            otherPlayerId = data.id;
        }

        let position = 0;
        for (let i = 0; i < this.m_roomPlayerList.length; i++) {
            let data = this.m_roomPlayerList[i];
            if (data.id == playerId) {
                position = data.position;
                break;
            }
        }

        if (position == 0) {
            this.addSelfPlayer(0, cc.v2(this.m_playerPosition0.x, this.m_playerPosition0.y), playerId, 0);
            this.addOtherPlayer(1, cc.v2(this.m_playerPosition1.x, this.m_playerPosition1.y), otherPlayerId, 1)
        } else {
            this.addSelfPlayer(1, cc.v2(this.m_playerPosition1.x, this.m_playerPosition1.y), playerId, 1);
            this.addOtherPlayer(0, cc.v2(this.m_playerPosition0.x, this.m_playerPosition0.y), otherPlayerId, 0);
        }
        let joystickOc: Joystick = this.m_joystick.getComponent(Joystick);
        joystickOc.setEnabledMove(true);
        this.m_gameStart = true;
    }


    onReadyClick(): void {
        if (this.m_gameStart) {
            return;
        }

        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "readyS");
        let msg = msgObject.create({})
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_READY_S, msgEncode);
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    public onMsgRecvPlayerBombPlace(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerBombPlaceR");
        let msg = msgOC.decode(data);
        let position = cc.v2(msg.x, msg.y);
        this.addBombToMap(position, msg.power);
    }

    public addBombToMap(position: cc.Vec2, power: number): void {

        let playerId = LocalDataManager.getInstance().getPlayerId();
        let index = 0;
        for (let i = 0; i < this.m_roomPlayerList.length; i++) {
            let data = this.m_roomPlayerList[i];
            if (data.id == playerId) {
                index = data.position;
                break;
            }
        }

        let tiled = this.getTilePosition(position);
        let bomb = this.m_map.addComponent(Bomb);
        bomb.setBombPosition(position, tiled);
        bomb.setItemLayer(this.m_map);
        bomb.setPlayer(this.m_player);
        bomb.setOtherPlayer(this.m_otherPlayer);
        bomb.setIndex(index);
        bomb.setPower(power);
    }

    private getTilePosition(posInPixel) {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let mapTatolHeight = tileSize.height * mapSize.height;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(((mapTatolHeight - posInPixel.y) / tileSize.height));
        return cc.v2(x, y);
    }


    onPutDownBomb(): void {
        if (this.m_gameStart == false) {
            return;
        }
        let playerId = LocalDataManager.getInstance().getPlayerId();
        if (this.m_player.getPlayerId() == playerId) {
            this.m_player.putdownBomb();
        } else {
            this.m_otherPlayer.putdownBomb();
        }
    }

    public onMsgRecvSynPosition(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerSynPositionR");
        let msg = msgOC.decode(data);
        let id = msg.id;
        let x = msg.x;
        let y = msg.y;
        let direction = msg.direction;
        if (this.m_player.getPlayerId() == id) {
            this.m_player.updatePlayerPosition(cc.v2(x, y));
            this.m_player.updateMoveDirection(direction);
        } else {
            this.m_otherPlayer.updatePlayerPosition(cc.v2(x, y));
            this.m_otherPlayer.updateMoveDirection(direction);
        }
    }


    public onMsgRecvGameOver(data): void {
        let playerId = LocalDataManager.getInstance().getPlayerId();
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "gameOverR");
        let msg = msgOC.decode(data);
        let winId = msg.winId;

        if (winId == -1) {
            UIManager.getInstance().addUI("gameLose");
        }
        if (playerId == winId) {
            UIManager.getInstance().addUI("gameWin");
        } else {
            UIManager.getInstance().addUI("gameLose");
        }
    }

    public onMsgRecvBombExplode(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "bombExplodeR");
        let msg = msgOC.decode(data);
        let deadList = msg.deadList;

        let joystickOc: Joystick = this.m_joystick.getComponent(Joystick);
        joystickOc.setEnabledMove(false);

        for (let i = 0; i < deadList.length; i++) {
            let id = deadList[i];
            if (this.m_player.getPlayerId() == id) {
                this.m_player.setHelpAnimation();
            }

            if (this.m_otherPlayer.getPlayerId() == id) {
                this.m_otherPlayer.setHelpAnimation();
            }
        }
    }

    public onMsgRecvCreateProp(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "createPropR");
        let msg = msgOC.decode(data);
        let propList = msg.propList

        if (propList.length > 0) {
            let propData = propList[0];
            let v2 = cc.v2(propData.x, propData.y);
            let worldPosition = this.tiledConverToWorldPos(v2);
            let prop = this.m_map.addComponent(Prop);
            prop.init(worldPosition, propData.type, v2);
        }
    }

    private tiledConverToWorldPos(pos: cc.Vec2): cc.Vec2 {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let x = pos.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - pos.y) * tileSize.height - tileSize.height / 2;
        return cc.v2(x, y);
    }

    public onMsgRecvTriggerProp(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "triggerPropR");
        let msg = msgOC.decode(data);
        let tile = cc.v2(msg.x, msg.y);
        let prop: Prop = PropManager.getInstance().getPropByTile(tile);
        PropManager.getInstance().removeByTile(tile);
        prop.getPropNode().removeFromParent();
    }
}
