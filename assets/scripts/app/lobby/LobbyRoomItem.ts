import ProtoManager from "../../manager/ProtoManager";
import ProtoConstant from "../../constant/ProtoConstant";
import MsgUtil from "../../utils/MsgUtil";
import MsgCmdConstant from "../../constant/MsgCmdConstant";
import NetWebsocket from "../../manager/NetWebsocket";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyRoomItem extends cc.Component {

    @property(cc.Label)
    m_roomId: cc.Label = null;

    private m_data: any = null;


    onLoad() {
        this.m_roomId.string = this.m_data.roomId + "";
        let button = this.node.getChildByName("button").getComponent(cc.Button);
        button.node.on("click", this.joinRoom, this);
    }

    public initData(data): void {
        this.m_data = data;
    }

    public joinRoom(): void {
        let msgOC = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_ROOM, "joinRoomS")
        let msg = msgOC.create({ roomId: "" });
        let msgEncode = msgOC.encode(msg).finish();
        let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_S, msgEncode)
        NetWebsocket.getInstance().sendMsg(sendBuf);
    }
}
