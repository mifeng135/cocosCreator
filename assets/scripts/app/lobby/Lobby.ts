
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import LocalDataManager from "../../manager/LocalDataManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Label)
    m_playerName: cc.Label = null;

    onLoad() {
        this.addEventListener();
        this.m_playerName.string = LocalDataManager.getInstance().getPlayerName();
    }

    onDestroy() {
        this.removeEventListener();
    }

    private addEventListener() {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_R, this.onMsgRecvJoinRoom, this);
        
    }

    private removeEventListener() {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvJoinRoom);
    }

    onCreateRoom() {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "createRoomS")
        let msg = msgOC.create({});
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    private onMsgRecvCreateRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "createRoomR")
        let msg = msgOC.decode(data);
        if (msg.ret == 0) {
            cc.director.loadScene("gameScene");
        }
    }

    onJoinRoom() {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "joinRoomS")
        let msg = msgOC.create({});
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    private onMsgRecvJoinRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "joinRoomR")
        let msg = msgOC.decode(data);
        if(msg.ret == 0) {
            cc.director.loadScene("gameScene");
        }
    }
}
