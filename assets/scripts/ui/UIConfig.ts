

/**
 * 界面切换效果
 */
export enum TranslateType {
    NONE = 0, // no animation 
    LEFT = 1, // enter node from left
    RIGHT = 2,
    TOP = 3,
    BOTTOM = 4,
    ALPHA = 5,
}

/**
 * uiconfig
 * 界面配置
 * prefab 打开的界面 需要的 prefab 的资源 填写资源路径
 * name 打开界面的名称 key
 * preventTouch 时间屏蔽层
 * enterAnimation 界面进入的时候动画
 * exitAnimation 界面消失的时候动画
 * cache 是否将baseUIView放到内存中
 */

export const uiConfig = [
    {
        name: "loading",
        prefab: "prefab/common/loading",
        enterAnimation: TranslateType.LEFT,
        exitAnimation: TranslateType.LEFT,
        cache: false,
        quickClose: true,
    },
    {
        name: "ui1",
        prefab: "prefab/common/ui1",
        enterAnimation: TranslateType.RIGHT,
        exitAnimation: TranslateType.RIGHT,
        cache: false,
        quickClose: false,
    },
    {
        name: "ui2",
        prefab: "prefab/common/ui2",
        enterAnimation: TranslateType.BOTTOM,
        exitAnimation: TranslateType.LEFT,
        cache: false,
        quickClose: false,
    },
    {
        name: "ui3",
        prefab: "prefab/common/ui3",
        enterAnimation: TranslateType.TOP,
        exitAnimation: TranslateType.BOTTOM,
        cache: false,
        quickClose: false,
    },
    {
        name: "login",
        prefab: "",
        enterAnimation: TranslateType.ALPHA,
        exitAnimation: TranslateType.ALPHA,
        cache: false,
        quickClose: false,
    },
]