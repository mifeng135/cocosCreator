import MsgUtil from "../utils/MsgUtil";
import MsgCmdConstant from "../constant/MsgCmdConstant";
import CustomizeEvent from "../event/CustomizeEvent";
import ProtoManager from "./ProtoManager";
import LocalDataManager from "./LocalDataManager";
import MsgFactory from "../msg/MsgFactory";
import UIManager from "./UIManager";


export default class NetWebsocket extends cc.Component {

    private static m_instance: NetWebsocket = null;
    private m_socket: WebSocket = null;

    private constructor() {
        super();
    }

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
        this.m_socket.onclose = this.onCloseListener.bind(this);
    }

    private onOpenListener(ev: Event): void {
        let playerId = LocalDataManager.getInstance().getPlayerId();
        let data = {};
        data["playerId"] = playerId;
        this.sendMsg(MsgCmdConstant.MSG_CMD_LOGIN_TO_GATE_S, data);
        this.schedule(this.heartBeat, 30, cc.macro.REPEAT_FOREVER);
    }

    private heartBeat(): void {
        let data = {};
        this.sendMsg(MsgCmdConstant.MSG_HEART_BEAT_S, data);
    }
    private onMessageListener(ev: MessageEvent): void {
        var dv = new DataView(ev.data);
        let cmd = dv.getInt32(0);
        let dataLength = dv.getInt32(4);
        var u8view = new Uint8Array(ev.data, 8);

        let msgRecv = MsgFactory.getInstance().getRecv();
        let protoInfo = msgRecv.get(cmd);
        let msgObject = ProtoManager.getInstance().getMsg(protoInfo.protoFile, protoInfo.protoName);
        let decodeData = msgObject.decode(u8view);
        CustomizeEvent.getInstance().MFDispatchEvent(cmd, decodeData);
    }
    private onCloseListener(): void {
        this.unschedule(this.heartBeat);
        let param = {}
        param["text"] = "网络异常请重新登录";
        param["clickCallBack"] = this.onButtonClick;
        UIManager.getInstance().addUI("dialog", param);
    }

    private onButtonClick(): void {
        cc.director.loadScene("loginScene");
    }
    public sendMsg(cmd, data): void {
        let msgSend = MsgFactory.getInstance().getSend();
        let protoInfo = msgSend.get(cmd);
        let msgObject = ProtoManager.getInstance().getMsg(protoInfo.protoFile, protoInfo.protoName);
        let msg = msgObject.create(data);
        let msgEncode = msgObject.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(cmd, msgEncode);
        this.m_socket.send(sendBuf);
    }
}
