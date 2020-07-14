import ProtoManager from "../manager/ProtoManager";
import MsgCmdConstant from "../constant/MsgCmdConstant";
import MsgUtil from "../utils/MsgUtil";
import NetWebsocket from "../manager/NetWebsocket";
import ProtoConstant from "../constant/ProtoConstant";


const { ccclass, property } = cc._decorator;


enum DIRECTION {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3,
    NONE = 4,
}



@ccclass
export default class Joystick extends cc.Component {

    @property(cc.Node)
    m_rocker = null;

    private m_originPosition: cc.Vec2 = null;
    private m_direction: cc.Vec2 = cc.v2(0, 0);
    private m_maxRadius: number = 80;

    private m_directionEnum: number = 4; // 默认为没有方向

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
    onTouchStart(event) {
        this.setRockerPositionAndCalcDirection(this.node.convertToNodeSpaceAR(event.getLocation()));
    }

    private onTouchMove(event) {
        var location = event.getLocation();
        var position = this.node.convertToNodeSpaceAR(location);
        var distance = position.mag();
        if (distance > this.m_maxRadius) {
            position = cc.v2(position.x / distance * this.m_maxRadius, position.y / distance * this.m_maxRadius);
        }
        this.setRockerPositionAndCalcDirection(position);
        position = this.node.parent.convertToNodeSpaceAR(location);
        distance = position.sub(this.node.getPosition()).mag();
    }

    private onTouchEnd(event) {
        this.setRockerPositionAndCalcDirection(cc.v2(0, 0));
    }

    private onTouchCancel(event) {
        this.setRockerPositionAndCalcDirection(cc.v2(0, 0));
    }

    private setRockerPositionAndCalcDirection(position): void {
        this.m_rocker.position = position;
        this.calcDirection(position);
    }
    private calcDirection(position) {
        var distance = position.mag();
        if (distance == 0) {
            this.m_direction = cc.v2(0, 0);
            this.setDirectionEnum();
            return;
        }
        if (position.x <= position.y) {
            if (-position.x <= position.y) {
                this.m_direction = cc.v2(0, 1); // 上
            } else {
                this.m_direction = cc.v2(-1, 0); // 左
            }
        } else {
            if (-position.x >= position.y) {
                this.m_direction = cc.v2(0, -1); // 下
            } else {
                this.m_direction = cc.v2(1, 0); // 右
            }
        }

        this.setDirectionEnum();
    }

    private setDirectionEnum() {
        let direction: cc.Vec2 = this.m_direction;
        if (direction.x == 0 && direction.y == 0 && this.m_directionEnum != DIRECTION.NONE) {
            this.m_directionEnum = DIRECTION.NONE;
            this.sendDirectionMsg();
        }

        if (direction.y == 1 && this.m_directionEnum != DIRECTION.UP) {
            this.m_directionEnum = DIRECTION.UP;
            this.sendDirectionMsg();
        }
        if (direction.y == -1 && this.m_directionEnum != DIRECTION.DOWN) {
            this.m_directionEnum = DIRECTION.DOWN;
            this.sendDirectionMsg();
        }
        if (direction.x == -1 && this.m_directionEnum != DIRECTION.LEFT) {
            this.m_directionEnum = DIRECTION.LEFT;
            this.sendDirectionMsg();
        }
        if (direction.x == 1 && this.m_directionEnum != DIRECTION.RIGHT) {
            this.m_directionEnum = DIRECTION.RIGHT;
            this.sendDirectionMsg();
        }
    }

    private sendDirectionMsg() {
        // let msgObject = ProtoManager.getInstance().getMsg(ProtoConstant.PROTO_NAME_GAME, "playerPosS");
        // let msg = msgObject.create({ direction: this.m_directionEnum });
        // let msgEncode = msgObject.encode(msg).finish();
        // let sendBuf = MsgUtil.packMsg(MsgCmdConstant.MSG_CMD_PLAYER_POSITION_S, msgEncode);
        // NetWebsocket.getInstance().sendMsg(sendBuf);
    }
    public getDirection(): cc.Vec2 {
        return this.m_direction;
    }
}
