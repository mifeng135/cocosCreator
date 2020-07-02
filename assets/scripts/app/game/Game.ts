import Player from "./Player";
import CustomizeEvent from "../../event/CustomizeEvent";
import Joystick from "../../commonUI/Joystick";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    m_map: cc.TiledMap = null;


    @property(cc.Node)
    m_joystick = null;

    @property(cc.Button)
    m_bombButton = null;


    private m_player: Player = null;
    onLoad() {

        let players = this.m_map.getObjectGroup("players");

        let player1 = players.getObject("player1");
        this.m_player = this.m_map.addComponent(Player);

        let ff = this.m_joystick.getComponent(Joystick);
        this.m_player.setPosition(cc.v2(player1.x, player1.y));
        this.m_player.setMap(this.m_map);
        this.m_player.setJoystick(ff);
    }

    onPutDownBomb(): void {
        this.m_player.putdownBomb();
    }
}
