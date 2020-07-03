import { loginToGateS } from "../proto/LoginMsg";
import MsgUtil from "../utils/MsgUtil";
import MsgCmdConstant from "../constant/MsgCmdConstant";
import { playerInfoR, playerInfoS } from "../proto/DataBaseMsg";
import CustomizeEvent from "../event/CustomizeEvent";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NetWebsocket {

    private static m_instance: NetWebsocket = null;
    private m_socket: WebSocket = null;

    private m_playerIndex: number = 0;

    private constructor() { }

    public static getInstance(): NetWebsocket {
        if (this.m_instance == null) {
            this.m_instance = new NetWebsocket();
        }
        return this.m_instance;
    }

    public initWebSocket(ip: string = '', playerIndex: number): void {
        if (ip.length <= 0) {
            return;
        }
        this.m_socket = new WebSocket("ws://" + ip);
        this.m_socket.binaryType = "arraybuffer";
        this.m_socket.onopen = this.onOpenListener.bind(this);
        this.m_socket.onmessage = this.onMessageListener.bind(this);
        this.m_playerIndex = playerIndex;
    }

    private onOpenListener(ev: Event): void {
        let msg = loginToGateS.create({ playerIndex: this.m_playerIndex })
        let msgEncode = loginToGateS.encode(msg).finish();
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
        console.log("being");
        this.m_socket.send(data1);
    }

}
