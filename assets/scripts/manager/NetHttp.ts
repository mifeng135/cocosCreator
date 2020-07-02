import { loginR } from "../proto/LoginMsg";
import NetWebsocket from "./NetWebsocket";
import MsgCmdConstant from "../constant/MsgCmdConstant";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NetHttp {
    private static m_instance: NetHttp = null;

    private constructor() { }

    public static getInstance(): NetHttp {
        if (this.m_instance == null) {
            this.m_instance = new NetHttp();
        }
        return this.m_instance;
    }

    public post(data): void {
        let xhr = cc.loader.getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status == 200) {
                let respone = xhr.response;
                var dv = new DataView(respone);
                let cmd = dv.getInt32(0); //设置一个cmd
                let dataLength = dv.getInt32(4);
                var u8view = new Uint8Array(respone, 8);
                NetHttp.getInstance().decodeMsg(cmd, u8view);
            }
        };
        xhr.open('POST', "http://192.168.1.217:8000", true);
        xhr.responseType = "arraybuffer"
        xhr.send(data)
    }

    public decodeMsg(cmd: number, u8: Uint8Array): void {
        if (cmd == MsgCmdConstant.MSG_CMD_LOGIN_R) {
            let data: loginR = loginR.decode(u8);
            if (data.ret == MsgCmdConstant.MSG_RET_CODE_SUCCESS) {
                NetWebsocket.getInstance().initWebSocket(data.ip, data.playerIndex);
            }
        }
    }
}
