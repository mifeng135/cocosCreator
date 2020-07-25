export default class ProtoManager {

    private m_protodMap = {};

    private static m_instance: ProtoManager = null;

    public static getInstance(): ProtoManager {
        if (this.m_instance == null) {
            this.m_instance = new ProtoManager();
        }
        return this.m_instance;
    }

    private constructor() {
    }

    public loaderProto(): void {
        cc.loader.loadResDir("proto", cc.TextAsset, (err, protos) => {
            if (err) {
                return
            }
            for (let proto of protos) {
                this.m_protodMap[proto.name] = protobuf.parse(proto);
            }
        })
    }

    public getMsg(protoName: string, msgName: string): any {
        let obj = this.m_protodMap[protoName]
        if(obj) {
            return obj.root.lookup(msgName);
        }
        return null;
    }
}
