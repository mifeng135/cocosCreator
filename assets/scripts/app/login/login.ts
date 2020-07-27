import NetWebsocket from "../../manager/NetWebsocket";
import NetHttp from "../../manager/NetHttp";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import LocalDataManager from "../../manager/LocalDataManager";
import UIManager from "../../manager/UIManager";
import MsgFactory from "../../msg/MsgFactory";
import AppGlobal from "../../manager/AppGlobal";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {



    private m_account: string = "";
    private m_password: string = "";

    protected onLoad(): void {
        AppGlobal.getInstance().initGlobalEvent();
        MsgFactory.getInstance().init();
        ProtoManager.getInstance().loaderProto();

        this.addEventListener();
        this.addUIEvent();
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
        if (data.ret == MsgCmdConstant.MSG_RET_CODE_SUCCESS) {
            LocalDataManager.getInstance().setPlayerInfo(data.id, data.name);
            LocalDataManager.getInstance().setSocketIp(data.ip);
            NetWebsocket.getInstance().initWebSocket();
            cc.director.loadScene("lobbyScene");
        } else {

            let param = {}
            param["text"] = "您的账号在其他地方登陆";
            param["clickCallBack"] = this.onButtonClick;
            UIManager.getInstance().addUI("dialog", param);
        }
    }

    private onButtonClick(): void {

    }

    
    public onAccountClick(): void {
        let data = {}
        data["account"] = this.m_account;
        data["password"] = this.m_password;
        NetHttp.getInstance().post(MsgCmdConstant.MSG_CMD_LOGIN_S, data);
    }

    public onToggleClick(event): void {

    }

}
