import CustomizeEvent from "../event/CustomizeEvent";
import ResManager from "../manager/ResManager";
import SceneManager from "../manager/SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UpdateScene extends cc.Component {

    @property({ type: cc.Asset })
    m_manifestUrl = null;

    @property(cc.Label)
    m_updateLable = null;

    @property({ type: cc.Button })
    m_updateButton = null;

    private m_assetManager = null;
    private m_updateFailCount: number = 0;

    public constructor() {
        super();
    }
    protected onLoad(): void {
        ResManager.getInstance().permanentLoadRes("prefab/common/loading");
        if (!cc.sys.isNative) {
            return;
        }
        let storagePath: string = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset';
        this.m_assetManager = new jsb.AssetsManager(this.m_manifestUrl.nativeUrl, storagePath);

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.m_assetManager.setMaxConcurrentTask(1);
        }

        this.m_assetManager.setEventCallback(this.checkUpdateCallBack.bind(this));
        this.m_assetManager.checkUpdate();
    }

    protected start(): void {
        if (!cc.sys.isNative) {
            ResManager.getInstance().permanentLoadRes("prefab/common/loading", () => {
                SceneManager.getInstance().runScene("loginScene");
            });
        }
    }
    private checkUpdateCallBack(event: jsb.EventAssetsManager): void {
        let code = event.getEventCode();
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.m_updateLable.string = "本地没有配置文件~";
                this.m_assetManager.setEventCallback(null);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.m_updateLable.string = "下载远程配置文件失败";
                this.m_assetManager.setEventCallback(null);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.m_updateLable.string = "您已经是最新版本";
                this.m_assetManager.setEventCallback(null);
                SceneManager.getInstance().runScene("loginScene");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.m_updateLable.string = "发现新版本，需要更新";
                this.m_assetManager.setEventCallback(null);
                this.m_updateButton.node.active = true;
                break;
        }
    }

    public onUpdateClick(): void {
        this.m_assetManager.setEventCallback(this.updateCallBack.bind(this))
        this.m_assetManager.update();
        this.m_updateButton.node.active = false;
    }

    private updateCallBack(event: jsb.EventAssetsManager): void {
        let updateFail = false;
        let updateFinish = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.m_updateLable.string = "本地没有配置文件~";
                updateFail = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.m_updateLable.string = "loading + loading + loading";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.m_updateLable.string = "下载远程配置文件失败";
                updateFail = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.m_updateLable.string = "您已经是最新版本";
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.m_updateLable.string = "更新成功";
                updateFinish = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.m_updateFailCount++;
                if (this.m_updateFailCount < 3) {
                    this.m_assetManager.downloadFailedAssets();
                } else {
                    this.m_updateLable.string = "更新失败，请检查您的网络";
                    updateFail = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                break;
            default:
                break;
        }

        if (updateFail) {
            this.m_assetManager.setEventCallback(null);
        }

        if (updateFinish) {
            this.m_assetManager.setEventCallback(null);
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this.m_assetManager.getLocalManifest().getSearchPaths();
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }
}
