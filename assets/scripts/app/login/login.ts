import NetWebsocket from "../../manager/NetWebsocket";
import MsgUtil from "./../../utils/MsgUtil"
import NetHttp from "../../manager/NetHttp";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import LocalDataManager from "../../manager/LocalDataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Button)
    m_accountButton = null;

    protected async onLoad(): Promise<void> {
        ProtoManager.getInstance().loaderProto();
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
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_LOGIN, "loginR");
        let decodeData = msgObject.decode(data);
        if (decodeData.ret == MsgCmdConstant.MSG_RET_CODE_SUCCESS) {
            LocalDataManager.getInstance().setPlayerInfo(decodeData.id, decodeData.name);
            LocalDataManager.getInstance().setSocketIp(decodeData.ip);
            NetWebsocket.getInstance().initWebSocket();
            cc.director.loadScene("lobbyScene");
        }
    }

    public onAccountClick(): void {
        let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_LOGIN, "loginS");
        let msg = msgObject.create({ account: "123123", password: "123123" })
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_LOGIN_S, msgEncode);
        NetHttp.getInstance().post(sendBuf);
    }

    public onToggleClick(event): void {

    }

}
