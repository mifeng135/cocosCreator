
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import MsgUtil from "../../utils/MsgUtil";
import NetWebsocket from "../../manager/NetWebsocket";
import CustomizeEvent from "../../event/CustomizeEvent";
import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import LocalDataManager from "../../manager/LocalDataManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Label)
    m_playerName: cc.Label = null;


    @property(cc.Node)
    m_scrollContent: cc.Node = null;

    @property(cc.Prefab)
    m_scrollItem: cc.Prefab = null;


    onLoad() {
        this.addEventListener();
        this.m_playerName.string = LocalDataManager.getInstance().getPlayerName();
        this.requestRoomList();
    }

    onDestroy() {
        this.removeEventListener();
    }

    private addEventListener() {
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_R, this.onMsgRecvJoinRoom, this);
        CustomizeEvent.getInstance().MFAddEventListener(MsgCmdConstant.MSG_CMD_GAME_ROOM_LIST_R, this.onMsgRecvRoomList, this);

    }

    private removeEventListener() {
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvCreateRoom);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, this.onMsgRecvJoinRoom);
        CustomizeEvent.getInstance().MFRemoveEventListener(MsgCmdConstant.MSG_CMD_GAME_ROOM_LIST_R, this.onMsgRecvRoomList);
    }

    private requestRoomList(): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "roomListS")
        let msg = msgOC.create({});
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_ROOM_LIST_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    onCreateRoom() {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "createRoomS")
        let msg = msgOC.create({});
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }

    private onMsgRecvCreateRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "createRoomR")
        let msg = msgOC.decode(data);
        if (msg.ret == 0) {
            cc.director.loadScene("gameScene");
        }
    }

    private onMsgRecvJoinRoom(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "joinRoomR")
        let msg = msgOC.decode(data);
        if (msg.ret == 0) {
            cc.director.loadScene("gameScene");
        }
    }

    private onMsgRecvRoomList(data): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "roomListR")
        let msg = msgOC.decode(data);
        let roomList = msg.roomList;
        this.drawRoomList(roomList);
    }

    private drawRoomList(roomList): void {
        let length = roomList.length;
        for (let i = 0; i < length; i++) {
            let data = roomList[i];
            let node = cc.instantiate(this.m_scrollItem);
            let item = node.getComponent('LobbyRoomItem');
            item.initData(data);
            node.y = node.y - i * this.m_scrollItem.data.height;
            this.m_scrollContent.addChild(node);
        }
        this.m_scrollContent.height = length * this.m_scrollItem.data.height;
    }

}
