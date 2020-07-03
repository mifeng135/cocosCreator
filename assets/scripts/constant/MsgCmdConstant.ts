

const { ccclass, property } = cc._decorator;

@ccclass
export default class MsgCmdConstant {


    public static MSG_RET_CODE_SUCCESS: number = 0;

    public static MSG_CMD_LOGIN_TO_GATE_S: number = 1;

    public static MSG_CMD_DB_PLAYER_INFO_S: number = 3001;
    public static MSG_CMD_DB_PLAYER_INFO_R: number = 3002;

    
    public static MSG_CMD_LOGIN_S: number = 1001;

    public static MSG_CMD_LOGIN_R: number = 1002;


    
}
