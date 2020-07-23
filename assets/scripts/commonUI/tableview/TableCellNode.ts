


export default class TableCellNode extends cc.Node {
    idx: number;//复用的时候会更改IDX
    realIdx: number;//用于标记第一次创建的时候的IDX

    constructor() {
        super();
        this.anchorY = 1;
        this.idx = -1;
        this.realIdx = -1;
    }
}