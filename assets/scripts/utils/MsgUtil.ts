
const { ccclass, property } = cc._decorator;

@ccclass
export default class MsgUtil {

    public static packMsg(cmd: number, data: any): ArrayBuffer {
        var sendBuf = new ArrayBuffer(data.length + 8);
        var dataView = new DataView(sendBuf);
        dataView.setInt32(0, cmd);
        dataView.setInt32(4, data.length);
        var u8view = new Uint8Array(sendBuf, 8);
        for (var i = 0, strLen = data.length; i < strLen; ++i) {
            u8view[i] = data[i];
        }
        return sendBuf;
    }


}
