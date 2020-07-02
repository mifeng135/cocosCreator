
const { ccclass, property } = cc._decorator;


/***
 * 内容节点适配
 * 以屏幕中间线平分 分为左侧和右侧 
 * ------------------
 * |  左   |     右 |
 * |  侧   |     侧 |
 * ------------------
 * 靠近左侧的勾选left以后可以一直保持距离屏幕左侧的固定距离
 * 靠近右侧的勾选left以后可以一直保持距离屏幕右侧的固定距离
 */
@ccclass
export default class MFWidget extends cc.Component {

    @property(cc.Boolean)
    leftAlign: boolean = false;

    @property(cc.Boolean)
    rightAlign: boolean = false;

    onLoad() {
        let contentSize = this.node.getContentSize();
        let visibleSize = cc.view.getVisibleSize();
        if (this.leftAlign) {
            this.node.x = -visibleSize.width / 2 + contentSize.width / 2;
        } else if (this.rightAlign) {
            this.node.x = visibleSize.width / 2 - contentSize.width / 2;
        }
    }
}
