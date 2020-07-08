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
    private m_playerMapObject = null;

    private m_otherPlayer: OtherPlayer = null;
    private m_otherPlayerMapObject: any = null;


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
        this.m_playerMapObject = players.getObject("player1");
        this.m_otherPlayerMapObject = players.getObject("player2");
    }

    public addEventListener(): void {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart, this);

    }

    private removeEventListener(): void {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_START_R, this.onMsgRecvGameStart);
    }

    onMsgRecvOtherJoinRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "roomPlayerListR");
        let msg = msgOC.decode(data);
        this.m_roomPlayerList = msg.playerList
    }

    public selfJoin(direction, position): void {
        this.m_player = this.m_map.addComponent(Player);
        this.m_player.setPosition(position);
        this.m_player.setMap(this.m_map);
        this.m_player.setJoystick(this.m_joystick.getComponent(Joystick));
        this.m_player.initSpriteDirection(direction);
    }

    public otherJoin(direction, position): void {
        this.m_otherPlayer = this.m_map.addComponent(OtherPlayer);
        this.m_otherPlayer.setPosition(position);
        this.m_otherPlayer.setMap(this.m_map);
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
        let position = 0;
        for (let i = 0; i < this.m_roomPlayerList.length; i++) {
            let data = this.m_roomPlayerList[i];
            if (data.id == playerId) {
                position = data.position;
            }
        }
        if (position == 0) { //左上角
            this.selfJoin(0, cc.v2(this.m_playerMapObject.x, this.m_playerMapObject.y));
            this.otherJoin(1, cc.v2(this.m_otherPlayerMapObject.x, this.m_otherPlayerMapObject.y))
        } else {
            this.selfJoin(0, cc.v2(this.m_otherPlayerMapObject.x, this.m_otherPlayerMapObject.y));
            this.otherJoin(1, cc.v2(this.m_playerMapObject.x, this.m_playerMapObject.y))
        }
    }
    onReadyClick(): void {
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "readyS");
        let msg = msgObject.create({})
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_READY_S, msgEncode);
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    onPutDownBomb(): void {
        this.m_player.putdownBomb();
    }
}
