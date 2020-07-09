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

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    m_map: cc.TiledMap = null;


    @property(cc.Node)
    m_joystick = null;

    @property(cc.Button)
    m_bombButton = null;


    private m_player: Player = null;
    private m_playerPosition0 = null; //左上角

    private m_otherPlayer: OtherPlayer = null;
    private m_playerPosition1: any = null; //右下角


    private m_roomPlayerList: Array<any> = new Array();


    onLoad() {
        this.init();
        this.addEventListener();
    }

    onDestroy() {
        this.removeEventListener();
    }
    private init(): void {
        let players = this.m_map.getObjectGroup("players");
        this.m_playerPosition0 = players.getObject("player1");
        this.m_playerPosition1 = players.getObject("player2");
    }

    public addEventListener(): void {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_R, this.onMsgRecvPlayerBombPlace, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_PLAYER_POSITION_R, this.onMsgRecvPlayerPos, this);

    }

    private removeEventListener(): void {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_R, this.onMsgRecvPlayerBombPlace);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_PLAYER_POSITION_R, this.onMsgRecvPlayerPos);
    }

    onMsgRecvOtherJoinRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "roomPlayerListR");
        let msg = msgOC.decode(data);
        this.m_roomPlayerList = msg.playerList
    }

    public addSelfPlayer(direction, position, playerId): void {
        this.m_player = this.m_map.addComponent(Player);
        this.m_player.setPosition(position);
        this.m_player.setMap(this.m_map);
        this.m_player.setPlayerId(playerId);
        this.m_player.setJoystick(this.m_joystick.getComponent(Joystick));
        this.m_player.initSpriteDirection(direction);
    }

    public addOtherPlayer(direction, position, playerId): void {
        this.m_otherPlayer = this.m_map.addComponent(OtherPlayer);
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
            this.addSelfPlayer(0, cc.v2(this.m_playerPosition0.x, this.m_playerPosition0.y), playerId);
            this.addOtherPlayer(0, cc.v2(this.m_playerPosition1.x, this.m_playerPosition1.y), otherPlayerId)
        } else {
            this.addSelfPlayer(1, cc.v2(this.m_playerPosition1.x, this.m_playerPosition1.y), playerId);
            this.addOtherPlayer(1, cc.v2(this.m_playerPosition0.x, this.m_playerPosition0.y), otherPlayerId)
        }
    }



    onReadyClick(): void {
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
        this.addBombToMap(position);
    }

    public addBombToMap(position: cc.Vec2): void {
        let tiled = this.getTilePosition(position);
        let bomb = this.m_map.addComponent(Bomb);
        bomb.setBombPosition(position, tiled);
        bomb.setItemLayer(this.m_map);
    }

    private getTilePosition(posInPixel) {
        let tileSize = this.m_map.getTileSize();
        let mapSize = this.m_map.getMapSize();
        let mapTatolHeight = tileSize.height * mapSize.height;
        let x = Math.floor(posInPixel.x / tileSize.width);
        let y = Math.floor(((mapTatolHeight - posInPixel.y) / tileSize.height));
        return cc.v2(x, y);
    }

    public onMsgRecvPlayerPos(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerPosR");
        let msg = msgOC.decode(data);
        let direction = msg.direction;
        let id = msg.id;
        if (this.m_player.getPlayerId() == id) {
            this.m_player.updateMoveDirection(direction);
        } else {
            this.m_otherPlayer.updateMoveDirection(direction);
        }
    }
    onPutDownBomb(): void {
        let playerId = LocalDataManager.getInstance().getPlayerId();
        if (this.m_player.getPlayerId() == playerId) {
            this.m_player.putdownBomb();
        } else {
            this.m_otherPlayer.putdownBomb();
        }
    }
}
