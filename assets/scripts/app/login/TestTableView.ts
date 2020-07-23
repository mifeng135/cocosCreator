import TableView from "../../commonUI/tableview/TableView";
import TableCellNode from "../../commonUI/tableview/TableCellNode";



const { ccclass, property } = cc._decorator;

@ccclass
export default class TestTableView extends TableView {


    private mDataSource: Array<any> = new Array();

    onLoad() {
        super.onLoad();
    }

    public setData(data) {
        this.mDataSource = data;
        this.reload();
    }

    getComponentName(): string {
        return "TestTableView";
    }

    tableCellAtIndex(table: TableView, idx: number): TableCellNode {
        let cell: TableCellNode = table.dequeueCell();
        if (!cell) {
            cell = new TableCellNode();
            cell.name = "TableCellNode"
            cell.color = cc.Color.RED;
            let lable = cell.addComponent(cc.Label);
            lable.string = idx + "tablecell";
        } else {
            let lable = cell.addComponent(cc.Label);
            lable.string = idx + "tablecell";
        }
        return cell;
    }
    tableCellSizeForIndex(table: TableView, idx: number): cc.Size {
        return cc.size(220, 50);
    }
    numberOfCellsInTableView(table: TableView): number {
        return this.mDataSource.length;
    }
    tableCellTouched(table: TableView, cell: TableCellNode, touch: cc.Touch): void {
        let index = cell.idx;
        console.log("点击item = " + index);
    }
}
