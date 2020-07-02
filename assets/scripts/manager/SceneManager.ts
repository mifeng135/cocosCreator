

/***
 *      ┌─┐       ┌─┐
 *   ┌──┘ ┴───────┘ ┴──┐
 *   │                 │
 *   │       ───       │
 *   │  ─┬┘       └┬─  │
 *   │                 │
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘
 *                神兽保佑
 *               代码无BUG!
 */


import ResManager from "./ResManager";

import { ResUtil } from "../resLoader/ResUtil"

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneManager {

    private static m_instance: SceneManager = null;

    public static getInstance(): SceneManager {
        if (this.m_instance == null) {
            this.m_instance = new SceneManager();
        }
        return this.m_instance;
    }

    private constructor() { }

    public runScene(sceneName: string, onLaunched?: Function): void {
        if (!sceneName) {
            throw new Error("SceneManager runScene sceneName error")
        }
        cc.loader.getDependsRecursively("loading");
        let loadPrefabData = ResManager.getInstance().getPermanentdByName("loading");
        if (loadPrefabData) {
            let loadingPrefab = ResUtil.instantiate(loadPrefabData);
            cc.director.getScene().addChild(loadingPrefab, 1, "loading");
        }
        let onLaunchedCallback = function () {
            cc.director.loadScene(sceneName, onLaunched);
        }
        cc.director.preloadScene(sceneName, this.preloadProgress.bind(this), onLaunchedCallback)
    }

    protected preloadProgress(completedCount: number, totalCount: number, item: any): void {
        let loadingNode = cc.director.getScene().getChildByName("loading");
        var loadingScript = loadingNode.getComponent('Loading');
        let percent = completedCount / totalCount;
        loadingScript.updateProgressPercent(percent);
    }
}
