
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
    private m_direction: cc.Vec2 = cc.v2(0, 0);
    private m_maxRadius: number = 80;


    private m_enableMove: boolean = true;
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event) {
        this.setRockerPositionAndCalcDirection(this.node.convertToNodeSpaceAR(event.getLocation()));
    }

    public setEnabledMove(enabled: boolean): void {
        this.m_enableMove = enabled;
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
        if(this.m_enableMove == false) {
            this.m_direction = cc.v2(0, 0);
            return;
        }
        var distance = position.mag();
        if (distance == 0) {
            this.m_direction = cc.v2(0, 0);
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
    }

    public getDirection(): cc.Vec2 {
        return this.m_direction;
    }
}
