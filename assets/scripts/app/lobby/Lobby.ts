
import { playerInfoS, playerInfoR } from "../../proto/DataBaseMsg";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";
import CustomizeEvent from "../../event/CustomizeEvent";
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
        let dbMsg = playerInfoS.create({ id: 1 })
        let dbMsgEncode = playerInfoS.encode(dbMsg).finish();
        let dbSendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_S, dbMsgEncode)
        NetWebsocket.getInstance().sendMsg(dbSendBuf);
    }

    private addEventListener() {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_R, this.onMsgRecvPlayerInfo, this);
    }

    private removeEventListener() {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_DB_PLAYER_INFO_R, this.onMsgRecvPlayerInfo);
    }

    private onMsgRecvPlayerInfo(data): void {
        let playerData = playerInfoR.decode(data);
        this.m_playerName.string = playerData.name;
    }

    onBeginGame() {

    }
}
