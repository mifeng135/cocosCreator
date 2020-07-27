

const { ccclass, property } = cc._decorator;

@ccclass
export default class MsgCmdConstant {


    public static MSG_RET_CODE_SUCCESS: number = 0;
    public static MSG_CMD_LOGIN_TO_GATE_S: number = 1;
    public static MSG_HEART_BEAT_S: number = 4;


    public static MSG_CMD_REPLACE_ACCOUNT_R = 101;
    /**
     * 1000 以内预留给服务器定义
     */

     
    //发送给web login 服务器
    public static MSG_CMD_LOGIN_S: number = 1001;
    public static MSG_CMD_LOGIN_R: number = 1002;


    //通过中转服务器发送到db服务器
    public static MSG_CMD_DB_BEGIN: number = 3000;
    public static MSG_CMD_DB_PLAYER_INFO_S: number = 3001;
    public static MSG_CMD_DB_PLAYER_INFO_R: number = 3002;
    public static MSG_CMD_DB_END: number = 3999;

    //通过gate发送到游戏服务器
    public static MSG_CMD_GAME_BEGIN: number = 4000;

    public static MSG_CMD_GAME_CREATE_ROOM_S: number = 4001;
    public static MSG_CMD_GAME_CREATE_ROOM_R: number = 4002;
    public static MSG_CMD_GAME_JOIN_ROOM_S: number = 4003;
    public static MSG_CMD_GAME_JOIN_ROOM_R: number = 4004;


    public static MSG_CMD_GAME_PLAYER_LEFT_ROOM_R: number = 4005;

    public static MSG_CMD_GAME_ROOM_LIST_R: number = 4006;
    public static MSG_CMD_GAME_ROOM_LIST_S: number = 4007;

    public static MSG_CMD_GAME_READY_S: number = 4008;
    public static MSG_CMD_GAME_READY_R: number = 4009;

    public static MSG_CMD_GAME_START_R: number = 4010;

    public static MSG_CMD_PLAYER_BOMB_PLACE_S: number = 4011;
    public static MSG_CMD_PLAYER_BOMB_PLACE_R: number = 4012;


    public static MSG_CMD_BOMB_EXPLODE_S: number = 4013;
    public static MSG_CMD_BOMB_EXPLODE_R: number = 4014;

    public static MSG_CMD_PLAYER_SYN_POSITION_S = 4015;
    public static MSG_CMD_PLAYER_SYN_POSITION_R = 4016;

    public static MSG_CMD_GAME_OVER_S = 4017; //这个暂时没有用到
    public static MSG_CMD_GAME_OVER_R = 4018;


    public static MSG_CMD_GAME_CREATE_PROP_S = 4019;
    public static MSG_CMD_GAME_CREATE_PROP_R = 4020;

    public static MSG_CMD_GAME_TRIGGER_PROP_S = 4021;
    public static MSG_CMD_GAME_TRIGGER_PROP_R = 4022;


    public static MSG_CMD_GAME_TILE_POSITION_SYN_S = 4023;
    public static MSG_CMD_GAME_AIRPLANE_PROP_R = 4024;


    public static MSG_CMD_GAME_EXIT_ROOM_S = 4025;
    public static MSG_CMD_GAME_EXIT_ROOM_R = 4026;


    public static MSG_CMD_GAME_END: number = 4999;

}
