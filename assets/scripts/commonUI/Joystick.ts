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
export default class Joystick extends cc.Component {

    @property(cc.Node)
    m_rocker = null;

    private m_originPosition: cc.Vec2 = null;
    private m_direction: cc.Vec2 = cc.v2(0, 0);
    private m_maxRadius: number = 80;

    onLoad() {
        this.m_originPosition = cc.v2(this.node.getPosition().x, this.node.getPosition().y);
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
        this.node.setPosition(cc.v2(this.m_originPosition.x, this.m_originPosition.y));
    }

    private onTouchCancel(event) {
        this.setRockerPositionAndCalcDirection(cc.v2(0, 0));
        this.node.setPosition(cc.v2(this.m_originPosition.x, this.m_originPosition.y));
    }

    private setRockerPositionAndCalcDirection(position): void {
        this.m_rocker.position = position;
        this.calcDirection(position);
    }
    private calcDirection(position) {
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
