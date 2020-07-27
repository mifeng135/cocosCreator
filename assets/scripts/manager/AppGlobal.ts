import CustomizeEvent from "../event/CustomizeEvent";
import MsgCmdConstant from "../constant/MsgCmdConstant";
import UIManager from "./UIManager";

export default class AppGlobal {

    private static m_instance: AppGlobal = null;

    public static getInstance(): AppGlobal {
        if (this.m_instance == null) {
            this.m_instance = new AppGlobal();
        }
        return this.m_instance;
    }

    private constructor() {
        this.initGlobalEvent();
    }


    public initGlobalEvent(): void {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_REPLACE_ACCOUNT_R, this.onMsgRecvReplaceAccount, this);
    }

    private onMsgRecvReplaceAccount(msg): void {

        let param = {}
        param["text"] = "您的账号在其他地方登陆";
        param["clickCallBack"] = this.onButtonClick;
        UIManager.getInstance().addUI("dialog", param);
    }

    private onButtonClick(): void {
        cc.director.loadScene("loginScene");
    }
}
