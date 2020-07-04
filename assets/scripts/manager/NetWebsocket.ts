import MsgUtil from "../utils/MsgUtil";
import MsgCmdConstant from "../constant/MsgCmdConstant";
import CustomizeEvent from "../event/CustomizeEvent";
import ProtoManager from "./ProtoManager";
import ProtoConstant from "../constant/ProtoConstant";
import LocalDataManager from "./LocalDataManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NetWebsocket {

    private static m_instance: NetWebsocket = null;
    private m_socket: WebSocket = null;

    private constructor() { }

    public static getInstance(): NetWebsocket {
        if (this.m_instance == null) {
            this.m_instance = new NetWebsocket();
        }
        return this.m_instance;
    }

    public initWebSocket(): void {
        let ip = LocalDataManager.getInstance().getSocketIp();
        this.m_socket = new WebSocket("ws://" + ip);
        this.m_socket.binaryType = "arraybuffer";
        this.m_socket.onopen = this.onOpenListener.bind(this);
        this.m_socket.onmessage = this.onMessageListener.bind(this);
    }

    private onOpenListener(ev: Event): void {
        let playerId = LocalDataManager.getInstance().getPlayerId();
        let msgoc = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_LOGIN, "loginToGateS")
        let msg = msgoc.create({ playerIndex: playerId })
        let msgEncode = msgoc.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_LOGIN_TO_GATE_S, msgEncode);
        this.sendMsg(sendBuf);
    }

    private onMessageListener(ev: MessageEvent): void {
        var dv = new DataView(ev.data);
        let cmd = dv.getInt32(0);
        let dataLength = dv.getInt32(4);
        var u8view = new Uint8Array(ev.data, 8);
        CustomizeEvent.getInstance().MFDispatchEvent(cmd, u8view);
    }

    public sendMsg(data1): void {
        this.m_socket.send(data1);
    }
}
