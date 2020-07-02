import BaseUIView from "../ui/BaseUIView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends BaseUIView {


    @property(cc.ProgressBar)
    m_loadingProgressBar = null;

    public updateProgressPercent(percent: number): void {
        this.m_loadingProgressBar.progress = percent;
    }
}
