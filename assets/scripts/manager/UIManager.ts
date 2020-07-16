


/***
 * 界面管理类 负责界面的切换，同时内存的释放
 * 当前类不支持同时打开相同的界面
 * 如果打开相同的界面的时候 上一个打开的界面就会自动关闭
 */
const { ccclass, property } = cc._decorator;

import { uiConfig, TranslateType } from "./../ui/UIConfig"
import BaseUIView from "../ui/BaseUIView";
import { resLoader } from "../resLoader/ResLoader";
import MFStack from "../utils/MFStack";

/**
 * BaseUIInfo
 * uiName 创建界面的名称 key
 * baseView ui界面
 * arg 打开界面传的参数
 * preventNode 阻拦点击事件
 * zOrder 添加到scene的层级
 */
interface BaseUIInfo {
    uiName: string,
    baseView: BaseUIView,
    arg: any,
    enterAnimation: number,
    exitAnimation: number,
    preventNode?: cc.Node,
    quickClose?: boolean,
    cache?: boolean,
    animationFinish?: Function,
}


@ccclass
export default class UIManager {

    private static m_instance: UIManager = null;

    /**
     * uiconfigmap loading for UIConfig
     */
    private m_uiConfigMap: Map<string, any> = new Map();

    /**
     * if uiConfig propertity cache is true
     * base ui view will push m_uiCache
     * m_uiCache will fast return one BaseUIView
     */
    private m_uiCache: Map<string, BaseUIView> = new Map();

    private m_useCount: number = 0;

    private m_stack: MFStack<BaseUIInfo> = new MFStack();

    public static getInstance(): UIManager {
        if (this.m_instance == null) {
            this.m_instance = new UIManager();
        }
        return this.m_instance;
    }

    private constructor() {
        this.parseUIConfig();
    }

    /**
     * 将列表中配置加载到config中
     */
    private parseUIConfig(): void {
        for (let i = 0; i < uiConfig.length; i++) {
            let data = uiConfig[i];
            this.m_uiConfigMap.set(data.name, data);
        }
    }

    /**
     * 每次新增一个界面的时候 生成一个唯一的key
     */
    private generateUserKey(): string {
        return `UIMgr_${++this.m_useCount}`;
    }

    /**
     * 将一个 uiconfig 配置 中的组件 添加到当前场景
     * @param uiName 
     * @param param 
     * @param processCallback 
     */
    public addUI(uiName: string, param?: any): void {
        this.check(uiName, param);
    }

    /**
     * 当 uiname 加载完成以后 
     * 关闭replaceUiName 界面
     * @param uiName 将要打开的界面
     * @param replaceUiName 将要关闭的界面
     * @param param 
     */
    public replace(uiName: string, replaceUiName: string, param?: any): void {
        if (uiName === replaceUiName) {
            throw new Error("UIManager replace replaceUiName and uiName is same name please use function <<closeUI>> instead");
        }
        this.check(uiName, param, () => {
            this.closeUI(replaceUiName);
        });
    }

    /**
     * 关闭到某个界面
     * @param uiName 
     */
    public popTo(uiName: string): void {
        if (!this.m_stack.containId(uiName)) {
            return;
        }
        for (let i = this.m_stack.size() - 1; i >= 0; i--) {
            let itemId: string = this.m_stack.getItemId(i);
            if (uiName === itemId) {
                break;
            }
            this.closeUI(itemId, false);
        }
    }

    /**
     * 关闭所有的打开界面
     */
    public popToRoot(): void {
        for (let i = this.m_stack.size() - 2; i >= 0; i--) {
            let itemId: string = this.m_stack.getItemId(i);
            this.closeUI(itemId, false);
        }
        this.closeUI();
    }
    /**
     * 开始检测错误 如果没有错误 则开始加载ui
     * @param uiName 
     * @param param 
     * @param animationFinish 
     */
    private check(uiName: string, param?: any, animationFinish?: Function): void {

        let uiinfo: BaseUIInfo = this.m_stack.peek();
        if (this.m_stack.size() > 0 && uiinfo.uiName === uiName) {
            return;
        }

        if (!uiName) {
            throw new Error("UIManager addUI uiId is null");
        }

        let uiConfig = this.m_uiConfigMap.get(uiName);
        if (!uiConfig) {
            throw new Error("UIManager addUI uiConfig is not in m_uiConfigMap by" + uiName);
        }

        /**
         * init one base info entity
         */
        let baseUIInfo: BaseUIInfo = {
            uiName: uiName,
            baseView: null,
            arg: param,
            enterAnimation: uiConfig.enterAnimation,
            exitAnimation: uiConfig.exitAnimation,
            cache: uiConfig.cache,
            quickClose: uiConfig.quickClose,
            animationFinish: animationFinish,
        };

        this.loadUI(uiName, (uiView: BaseUIView): void => {
            if (!uiView) {
                return;
            }
            baseUIInfo.preventNode = this.preventTouch();
            baseUIInfo.baseView = uiView;
            uiView.node.setContentSize(cc.winSize);
            uiView.node.addChild(baseUIInfo.preventNode, -2);
            this.addToScene(baseUIInfo);
        }, param);
    }
    /**
     * 加载组件
     * @param uiName 
     * @param completeCallback 
     * @param param 
     */
    private loadUI(uiName: string, completeCallback: (uiView: BaseUIView) => void, param?: any): void {

        let baseUIView: BaseUIView = this.m_uiCache.get(uiName);
        if (baseUIView) {
            completeCallback(baseUIView);
            return;
        }
        let uiConfig = this.m_uiConfigMap.get(uiName);

        let useKey = this.generateUserKey();

        let uiPath = uiConfig.prefab;

        resLoader.loadRes(uiConfig.prefab, null, (err: Error, prefab: cc.Prefab) => {
            if (err) {
                cc.log(`loadUI loadRes ${uiName} faile, error: ${err}`);
                completeCallback(null);
                return;
            }

            let uiNode: cc.Node = cc.instantiate(prefab);
            if (null == uiNode) {
                cc.log(`loadUI instantiate ${uiName} faile, path: ${uiPath}`);
                resLoader.releaseRes(uiPath, cc.Prefab);
                completeCallback(null);
                return;
            }

            baseUIView = uiNode.getComponent(BaseUIView);
            if (!baseUIView) {
                cc.log(`loadUI getComponent ${uiName} faile, path: ${uiPath}`);
                uiNode.destroy();
                resLoader.releaseRes(uiPath, cc.Prefab);
                completeCallback(null);
                return;
            }
            baseUIView.onInit(param);
            baseUIView.autoReleaseRes({ url: uiPath, type: cc.Prefab, use: useKey });
            completeCallback(baseUIView);
        }, useKey);
    }

    /**
     * 将加载好的组件添加到场景中
     * @param uiName 
     * @param uiInfo 
     */
    private addToScene(uiInfo: BaseUIInfo): void {
        let baseView: BaseUIView = uiInfo.baseView;
        baseView.node.active = true;

        let sceneNode = cc.director.getScene().getChildByName('Canvas');
        sceneNode.addChild(baseView.node);
        baseView.node.position = cc.v3(0, 0, 0);

        this.executeEnterAnimation(baseView, uiInfo.enterAnimation, () => {
            if (uiInfo.quickClose) {
                let quickCloseNode = new cc.Node()
                quickCloseNode.name = 'MFBackground';
                quickCloseNode.setContentSize(cc.winSize);
                baseView.node.addChild(quickCloseNode, -1);

                quickCloseNode.targetOff(cc.Node.EventType.TOUCH_START);
                quickCloseNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventCustom) => {
                    event.stopPropagation();
                    this.closeUI();
                }, quickCloseNode);
            }
            this.closeUI(uiInfo.uiName, false);
            this.m_stack.unActiveBottomUI();
            this.m_stack.push(uiInfo.uiName, uiInfo);
            if (uiInfo.animationFinish) {
                uiInfo.animationFinish();
            }
        })
    }


    public closeAll(): void {
        while (this.m_stack.size() > 0) {
            let baseUiInfo: BaseUIInfo = this.m_stack.pop();
            if (baseUiInfo.cache) {
                this.m_uiCache[baseUiInfo.uiName] = baseUiInfo.baseView;
                baseUiInfo.baseView.node.removeFromParent(false);
            } else {
                baseUiInfo.baseView.releaseAutoRes();
                baseUiInfo.baseView.node.destroy();
            }
        }
    }

    /**
     * 将baseUIView 从当前场景移除 如果传入name 则根据name 移除
     * 如果不传则是移除顶部界面
     * @param uiName 
     * @param animation 
     */
    public closeUI(uiName?: string, animation: boolean = true): void {

        if (this.m_stack.size() <= 0) {
            return;
        }

        let baseUiInfo: BaseUIInfo
        if (uiName) {
            baseUiInfo = this.m_stack.remove(uiName);
            if (!baseUiInfo) {
                return;
            }
        } else {
            baseUiInfo = this.m_stack.pop();
        }
        if (!baseUiInfo.baseView) {
            throw new Error("UIManager closeUI baseUIView is null");
        }

        if (baseUiInfo.preventNode) {
            baseUiInfo.preventNode.destroy();
            baseUiInfo.preventNode = null;
        }

        this.m_stack.activeTopUI();

        if (animation) {
            this.executeExitAnimation(baseUiInfo.baseView, baseUiInfo.exitAnimation, () => {
                if (baseUiInfo.cache) {
                    this.m_uiCache[baseUiInfo.uiName] = baseUiInfo.baseView;
                    baseUiInfo.baseView.node.removeFromParent(false);
                } else {
                    baseUiInfo.baseView.releaseAutoRes();
                    baseUiInfo.baseView.node.destroy();
                }
            })
        } else {
            if (baseUiInfo.cache) {
                this.m_uiCache[baseUiInfo.uiName] = baseUiInfo.baseView;
                baseUiInfo.baseView.node.removeFromParent(false);
            } else {
                baseUiInfo.baseView.releaseAutoRes();
                baseUiInfo.baseView.node.destroy();
            }
        }
    }

    /**
     * ui进入动画
     * @param baseUIView 
     * @param translateType 
     * @param completeCallback 
     */
    private executeEnterAnimation(baseUIView: BaseUIView, translateType: TranslateType, completeCallback: () => void): void {
        let sequenceAction
        let func = cc.callFunc(() => {
            completeCallback();
        })
        switch (translateType) {
            case TranslateType.ALPHA:
                baseUIView.node.opacity = 0;
                let aphlaAction = cc.fadeIn(0.3);
                sequenceAction = cc.sequence([aphlaAction, func]);
                break;
            case TranslateType.LEFT:
                baseUIView.node.position = cc.v3(-cc.winSize.width, 0, 0);
                let leftMoveAction = cc.moveTo(0.3, cc.v2(0, 0));
                sequenceAction = cc.sequence([leftMoveAction, func]);
                break;
            case TranslateType.RIGHT:
                baseUIView.node.position = cc.v3(cc.winSize.width, 0, 0);
                let rightMoveAction = cc.moveTo(0.3, cc.v2(0, 0));
                sequenceAction = cc.sequence([rightMoveAction, func]);
                break;
            case TranslateType.TOP:
                baseUIView.node.position = cc.v3(0, cc.winSize.height, 0);
                let topMoveAction = cc.moveTo(0.3, cc.v2(0, 0));
                sequenceAction = cc.sequence([topMoveAction, func]);
                break;
            case TranslateType.BOTTOM:
                baseUIView.node.position = cc.v3(0, -cc.winSize.height, 0);
                let bottomMoveAction = cc.moveTo(0.3, cc.v2(0, 0));
                sequenceAction = cc.sequence([bottomMoveAction, func]);
                break;
        }
        if (sequenceAction) {
            cc.tween(baseUIView.node).then(sequenceAction).start();
        } else {
            completeCallback();
        }
    }

    /**
     * ui退出动画
     * @param baseUIView 
     * @param translateType 
     * @param completeCallback 
     */
    private executeExitAnimation(baseUIView: BaseUIView, translateType: TranslateType, completeCallback: () => void): void {
        let sequenceAction
        let func = cc.callFunc(() => {
            completeCallback();
        })
        switch (translateType) {
            case TranslateType.ALPHA:
                let aphlaAction = cc.fadeOut(0.3);
                sequenceAction = cc.sequence([aphlaAction, func]);
                break;
            case TranslateType.LEFT:
                let leftMoveAction = cc.moveTo(0.3, cc.v2(-cc.winSize.width, 0));
                sequenceAction = cc.sequence([leftMoveAction, func]);
                break;
            case TranslateType.RIGHT:
                let rightMoveAction = cc.moveTo(0.3, cc.v2(cc.winSize.width, 0));
                sequenceAction = cc.sequence([rightMoveAction, func]);
                break;
            case TranslateType.TOP:
                let topMoveAction = cc.moveTo(0.3, cc.v2(0, cc.winSize.height));
                sequenceAction = cc.sequence([topMoveAction, func]);
                break;
            case TranslateType.BOTTOM:
                let bottomMoveAction = cc.moveTo(0.3, cc.v2(0, -cc.winSize.height));
                sequenceAction = cc.sequence([bottomMoveAction, func]);
                break;
        }
        if (sequenceAction) {
            cc.tween(baseUIView.node).then(sequenceAction).start();
        } else {
            completeCallback();
        }
    }

    /**
    * 添加防触摸层
    * @param zOrder 屏蔽层的层级
    */
    private preventTouch() {
        let node = new cc.Node()
        node.name = 'preventTouch';

        this.loadBack((res) => {
            let sprite = node.addComponent(cc.Sprite);
            var mylogo = new cc.SpriteFrame(res);
            sprite.spriteFrame = mylogo;
            node.setContentSize(cc.size(cc.winSize.width * 2,cc.winSize.height * 2));
            node.color = cc.Color.GRAY;
            node.opacity = 100;
        });
        node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventCustom) {
            event.stopPropagation();
        }, node);

        return node;
    }

    private loadBack(callBack): void {
        cc.loader.loadRes("common/default_panel", (error, res) => {
            if (error) {
            }
            callBack(res)
        })
    }
}
