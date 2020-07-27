import BaseUIView from "../ui/BaseUIView";
import UIManager from "../manager/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends BaseUIView {

    private m_contentLabel: cc.Label = null;


    private m_contentString: string = ""
    private m_callBack: any = null;
    onLoad() {
        this.addUiEvent();
    }

    private addUiEvent(): void {
        let button = this.node.getChildByName("button").getComponent(cc.Button);
        button.node.on("click", this.onButtonClick, this);
        this.m_contentLabel = this.node.getChildByName("content").getComponent(cc.Label);
        this.m_contentLabel.string = this.m_contentString;
    }

    public onInit(prarm: any): void {
        this.m_contentString = prarm.text;
        this.m_callBack = prarm.clickCallBack;
    }

    private onButtonClick(): void {
        UIManager.getInstance().closeUI();
        if(this.m_callBack) {
            this.m_callBack();
        }
    }
}
