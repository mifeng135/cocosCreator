import NetWebsocket from "../../manager/NetWebsocket";
import MsgUtil from "./../../utils/MsgUtil"
import NetHttp from "../../manager/NetHttp";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import LocalDataManager from "../../manager/LocalDataManager";
import UIManager from "../../manager/UIManager";
import TestTableView from "./TestTableView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {



    private m_account: string = "";
    private m_password: string = "";

    protected onLoad(): void {
        ProtoManager.getInstance().loaderProto();
        this.addEventListener();
        this.addUIEvent();
    }

    start() {
        let tableView: TestTableView = this.node.getChildByName("scrollview").getComponent(TestTableView);

        let data: Array<any> = new Array();
        for (let i = 0; i < 1000; i++) {
            data.push(i);
        }
        tableView.setData(data);
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

    private addUIEvent(): void {
        let account = this.node.getChildByName("loginback").getChildByName("account").getComponent(cc.EditBox);
        account.node.on("editing-did-ended", this.onAccountInputEnd, this);

        let password = this.node.getChildByName("loginback").getChildByName("password").getComponent(cc.EditBox);
        password.node.on("editing-did-ended", this.onPasswordInputEnd, this);

        let loginButton = this.node.getChildByName("loginback").getChildByName("login").getComponent(cc.Button);
        loginButton.node.on("click", this.onAccountClick, this);
    }

    private onAccountInputEnd(event): void {
        this.m_account = event.string;
    }
    private onPasswordInputEnd(event): void {
        this.m_password = event.string;
    }

    private onLogicR(data): void {
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_LOGIN, "loginR");
        let decodeData = msgObject.decode(data);
        if (decodeData.ret == MsgCmdConstant.MSG_RET_CODE_SUCCESS) {
            LocalDataManager.getInstance().setPlayerInfo(decodeData.id, decodeData.name);
            LocalDataManager.getInstance().setSocketIp(decodeData.ip);
            NetWebsocket.getInstance().initWebSocket();
            cc.director.loadScene("lobbyScene");
        } else {
            UIManager.getInstance().addUI("dialog", "账号或密码不正确");
        }
    }

    public onAccountClick(): void {
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_LOGIN, "loginS");
        let msg = msgObject.create({ account: this.m_account, password: this.m_password })
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_LOGIN_S, msgEncode);
        NetHttp.getInstance().post(sendBuf);
    }

    public onToggleClick(event): void {

    }

}
