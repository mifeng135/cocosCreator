

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
        name: "gameLose",
        prefab: "prefab/game/gameLose",
        cache: true,
    },
    {
        name: "gameWin",
        prefab: "prefab/game/gameWin",
        cache: true,
    },
]