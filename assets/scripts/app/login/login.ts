import UIManager from "../../manager/UIManager";
import NetWebsocket from "../../manager/NetWebsocket";
import { loginS } from "../../proto/LoginMsg"
import MsgUtil from "./../../utils/MsgUtil"
import NetHttp from "../../manager/NetHttp";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import CustomizeEvent from "../../event/CustomizeEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Button)
    m_accountButton = null;


    protected onLoad(): void {
        this.addEventListener();
    }
    protected onDestroy(): void {
        this.removeEventListener();
    }
    private addEventListener() {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_LOGIN_R, this.onLogicR, this);
    }

    private removeEventListener() {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_LOGIN_R, this.onLogicR)
    }

    private onLogicR(data): void {
        if (data.ret == MsgCmdConstant.MSG_RET_CODE_SUCCESS) {
            NetWebsocket.getInstance().initWebSocket(data.ip, data.playerIndex);
            cc.director.loadScene("lobbyScene");
        }
    }

    public onAccountClick(): void {
        let msg = loginS.create({ account: "123123", password: "123123" })
        let msgEncode = loginS.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_LOGIN_S, msgEncode);
        NetHttp.getInstance().post(sendBuf);
    }

    public onToggleClick(event): void {

    }
}
