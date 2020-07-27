import MsgCmdConstant from "../constant/MsgCmdConstant";
import ProtoConstant from "../constant/ProtoConstant";



interface protoInfo {
    protoFile: string,
    protoName: string,
}

export default class MsgFactory {

    private static m_instance: MsgFactory = null;
    private m_mapSend: Map<number, protoInfo> = new Map();
    private m_mapRecv: Map<number, protoInfo> = new Map();

    public static getInstance(): MsgFactory {
        if (this.m_instance == null) {
            this.m_instance = new MsgFactory();
        }
        return this.m_instance;
    }

    private constructor() {

    }

    public init(): void {
        this.initSend();
        this.initRecv();
    }
    private initSend(): void {
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_LOGIN_TO_GATE_S, { protoFile: ProtoConstant.PROTO_NAME_LOGIN, protoName: "loginToGateS" });

        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_LOGIN_S, { protoFile: ProtoConstant.PROTO_NAME_LOGIN, protoName: "loginS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_S, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "createRoomS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_S, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "joinRoomS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_ROOM_LIST_S, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "roomListS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_READY_S, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "readyS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "playerBombPlaceS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_BOMB_EXPLODE_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "bombExplodeS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_PLAYER_SYN_POSITION_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "playerSynPositionS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_CREATE_PROP_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "createPropS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_TRIGGER_PROP_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "triggerPropS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_TILE_POSITION_SYN_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "tilePositionSynS" });
        this.m_mapSend.set(MsgCmdConstant.MSG_CMD_GAME_EXIT_ROOM_S, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "exitRoomS" });
    }

    private initRecv(): void {
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_REPLACE_ACCOUNT_R, { protoFile: ProtoConstant.PROTO_NAME_LOGIN, protoName: "replaceAccountR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_LOGIN_R, { protoFile: ProtoConstant.PROTO_NAME_LOGIN, protoName: "loginR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_CREATE_ROOM_R, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "createRoomR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_JOIN_ROOM_R, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "joinRoomR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_ROOM_LIST_R, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "roomListR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_READY_R, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "readyR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_START_R, { protoFile: ProtoConstant.PROTO_NAME_ROOM, protoName: "gameStartR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_PLAYER_BOMB_PLACE_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "playerBombPlaceR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_BOMB_EXPLODE_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "bombExplodeR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_PLAYER_SYN_POSITION_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "playerSynPositionR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_OVER_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "gameOverR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_CREATE_PROP_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "createPropR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_TRIGGER_PROP_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "triggerPropR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_AIRPLANE_PROP_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "airplanePropR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_EXIT_ROOM_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "exitRoomR" });
        this.m_mapRecv.set(MsgCmdConstant.MSG_CMD_GAME_PLAYER_LEFT_ROOM_R, { protoFile: ProtoConstant.PROTO_NAME_GAME, protoName: "playerLeftRoomR" });
    }

    public getSend(): Map<number, protoInfo> {
        return this.m_mapSend;
    }

    public getRecv(): Map<number, protoInfo> {
        return this.m_mapRecv;
    }
}
