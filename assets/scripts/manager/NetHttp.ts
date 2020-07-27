import CustomizeEvent from "../event/CustomizeEvent";
import MsgFactory from "../msg/MsgFactory";
import ProtoManager from "./ProtoManager";
import MsgUtil from "../utils/MsgUtil";

export default class NetHttp {
    private static m_instance: NetHttp = null;

    private constructor() { }

    public static getInstance(): NetHttp {
        if (this.m_instance == null) {
            this.m_instance = new NetHttp();
        }
        return this.m_instance;
    }

    public post(cmd, data): void {
        let msgSend = MsgFactory.getInstance().getSend();
        let protoInfo = msgSend.get(cmd);
        let msgObject = ProtoManager.getInstance().getMsg(protoInfo.protoFile, protoInfo.protoName);
        let msg = msgObject.create(data);
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(cmd, msgEncode);
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
        xhr.send(sendBuf)
    }

    public decodeMsg(cmd: number, u8: Uint8Array): void {
        let msgRecv = MsgFactory.getInstance().getRecv();
        let protoInfo = msgRecv.get(cmd);
        let msgObject = ProtoManager.getInstance().getMsg(protoInfo.protoFile, protoInfo.protoName);
        let decodeData = msgObject.decode(u8);
        CustomizeEvent.getInstance().MFDispatchEvent(cmd, decodeData);
    }
}
