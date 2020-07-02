import UIManager from "../../manager/UIManager";
import NetWebsocket from "../../manager/NetWebsocket";
import { loginS } from "../../proto/LoginMsg"
import MsgUtil from "./../../utils/MsgUtil"
import NetHttp from "../../manager/NetHttp";
import MsgCmdConstant from "../../constant/MsgCmdConstant";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Button)
    m_accountButton = null;


    protected onLoad(): void {
    }

    public onAccountClick(): void {
        let msg = loginS.create({ account: "123123", password: "123123" })
        let msgEncode = loginS.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_LOGIN_S, msgEncode);
        NetHttp.getInstance().post(sendBuf);

        let animation = new cc.Animation();
    }

    public onToggleClick(event): void {

    }
}
