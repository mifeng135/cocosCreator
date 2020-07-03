
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Label)
    m_playerName: cc.Label = null;

    onLoad() {
        this.addEventListener();
        this.sendPlayerInfo();
    }

    onDestroy() {
        this.removeEventListener();
    }
    private sendPlayerInfo() {

        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_DB,"playerInfoS")
        let dbMsg = msgOC.create({ id: 1 })
        let dbMsgEncode = msgOC.encode(dbMsg).finish();
        let dbSendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_S, dbMsgEncode)
        NetWebsocket.getInstance().sendMsg(dbSendBuf);
    }

    private addEventListener() {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_R, this.onMsgRecvPlayerInfo, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom, this);

    }

    private removeEventListener() {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_R, this.onMsgRecvPlayerInfo);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom);
    }

    private onMsgRecvPlayerInfo(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_DB,"playerInfoR")
        let playerData = msgOC.decode(data);
        this.m_playerName.string = playerData.name;
    }

    onBeginGame() {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM,"createRoomS")
        let msg = msgOC.create({});
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    private onMsgRecvCreateRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM,"createRoomR")
        let msg = msgOC.decode(data);
        if (msg.ret == 0) {
            cc.director.loadScene("gameScene");
        }
    }
}
