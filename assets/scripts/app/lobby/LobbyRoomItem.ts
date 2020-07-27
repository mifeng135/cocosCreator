import MsgCmdConstant from "../../constant/MsgCmdConstant";
import NetWebsocket from "../../manager/NetWebsocket";

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
        let data = {};
        data["roomId"] = "";
        NetWebsocket.getInstance().sendMsg(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_S, data);
    }
}
