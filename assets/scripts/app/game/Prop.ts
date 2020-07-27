import PropManager from "./PropManager";
import ResManager from "../../manager/ResManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Prop extends cc.Component {



    private m_type: number = null; //0 提示炸弹威力 1 增加炸弹数量 2 提升移动速度
    private m_position: cc.Vec2 = null; //位置

    private m_animationArray: Array<cc.AnimationClip> = new Array();

    private m_propNode: cc.Node = null;
    private m_animation: cc.Animation = null;

    private m_tilePosition: cc.Vec2 = null;
    private m_action: boolean = false;
    private m_actionEndPos: cc.Vec2 = null;

    onLoad() {

    }

    async start() {

        if (ResManager.getInstance().getPermanentdByName("prop")) {
            this.m_animationArray = ResManager.getInstance().getPermanentdByName("prop")
        } else {
            this.m_animationArray = await this.loaderRes();
        }
        this.m_propNode = new cc.Node("propNode");
        this.m_propNode.addComponent(cc.Sprite);

        this.m_animation = this.m_propNode.addComponent(cc.Animation);

        for (let i = 0; i < this.m_animationArray.length; i++) {
            let animatioin = this.m_animationArray[i];
            animatioin.wrapMode = cc.WrapMode.Loop;
            this.m_animation.addClip(animatioin);
        }

        this.node.addChild(this.m_propNode);
        this.m_propNode.setPosition(this.m_position);
        if (this.m_type == 0) {
            this.m_animation.play("power")
        } else if (this.m_type == 1) {
            this.m_animation.play("bomb")
        } else {
            this.m_animation.play("move")
        }
        PropManager.getInstance().add(this);

        if (this.m_action) {
            this.m_propNode.zIndex = 22;
            let moveTo = cc.moveTo(0.5, this.m_actionEndPos);
            let callFunc = cc.callFunc(() => {
                this.m_propNode.zIndex = 8;
            })
            let sequence = cc.sequence(moveTo, callFunc)
            this.m_propNode.runAction(sequence)
        }
    }

    public init(position: cc.Vec2, type: number, tilePos: cc.Vec2): void {
        this.m_type = type;
        this.m_position = position;
        this.m_tilePosition = tilePos;
    }

    public initWithAction(beginPos: cc.Vec2, endPos: cc.Vec2, type: number, tilePos: cc.Vec2) {
        this.m_type = type;
        this.m_position = beginPos;
        this.m_tilePosition = tilePos;
        this.m_action = true;
        this.m_actionEndPos = endPos;
    }
    public getTilePosition(): cc.Vec2 {
        return this.m_tilePosition;
    }
    public getType(): number {
        return this.m_type;
    }

    public getPropNode(): cc.Node {
        return this.m_propNode;
    }
    public loaderRes(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            cc.loader.loadResDir("game/prop", cc.AnimationClip, (error, res) => {
                if (error) {
                    reject(error);
                }

                ResManager.getInstance().addPermanent("prop", res);
                resolve(res);
            })
        });
    }
}
