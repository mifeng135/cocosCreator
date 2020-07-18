

const { ccclass, property } = cc._decorator;

@ccclass
export default class LocalDataManager {

    private static m_instance: LocalDataManager = null;


    private m_id: number = -1;
    private m_name: string = "";
    private m_ip: string = "";

    private m_gameMapResName:string = "";


    public static getInstance(): LocalDataManager {
        if (this.m_instance == null) {
            this.m_instance = new LocalDataManager();
        }
        return this.m_instance;
    }

    private constructor() {

    }

    public setPlayerInfo(id: number, name: string): void {
        this.m_id = id;
        this.m_name = name;
    }

    public setSocketIp(ip: string): void {
        this.m_ip = ip;
    }
    
    public getSocketIp(): string {
        return this.m_ip;
    }

    public getPlayerId(): number {
        return this.m_id;
    }

    public getPlayerName(): string {
        return this.m_name;
    }

    public setGameMapResName(resName:string) :void {
        this.m_gameMapResName = resName;
    }

    public getGameMapResName() :string {
        return this.m_gameMapResName;
    }
}
