import TableCellNode from "./TableCellNode";


const { ccclass, property } = cc._decorator;

export default abstract class TableView extends cc.Component {

    private scrollView: cc.ScrollView = null;
    private mCurYList: number[] = [];
    private mCurCell: TableCellNode[] = [];
    private mIdleCell: TableCellNode[] = [];

    private mLastShowBeginI: number = 0;
    private mLastShowEndI: number = 0;
    private mLastTouch: cc.Touch = null;
    private mScrolling: boolean = false;

    onLoad() {
        this.scrollView = this.getComponent(cc.ScrollView);
        let event = new cc.Component.EventHandler();
        event.target = this.node;
        event.component = this.getComponentName();
        event.handler = "onScrollEvent";
        this.scrollView.scrollEvents.push(event);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: cc.Event.EventTouch) {
        this.mLastTouch = event.touch;
    }

    dequeueCell(): TableCellNode {
        if (this.mIdleCell.length > 0) {
            return this.mIdleCell.pop();
        }
        return null;
    }

    reload() {
        if (!cc.isValid(this.scrollView)) {
            return;
        }

        while (this.mCurCell.length > 0) {
            let idle = this.mCurCell.pop();
            idle.active = false;
            this.mIdleCell.push(idle);
        }


        this.scrollView.content.y = this.scrollView.node.height / 2;//回退到最上面
        let len = this.numberOfCellsInTableView(this);
        let viewPortH = this.node.height;
        this.mCurYList = [];
        let curH = 0;
        this.mLastShowBeginI = 0;
        this.mLastShowEndI = 0;
        let i = 0;
        for (; i < len; i++) {
            let curCellH = this.tableCellSizeForIndex(this, i).height;
            if (curH < viewPortH) {
                this.mLastShowEndI = i;
            }
            this.mCurYList.push(-curH);
            curH += curCellH;
        }
        this.scrollView.content.height = curH;

        for (let i = this.mLastShowBeginI; i <= this.mLastShowEndI; i++) {
            let cell = this.tableCellAtIndex(this, i);
            cell.idx = i;
            if (!cell.parent) {
                this.scrollView.content.addChild(cell);
            }
            if (cell.realIdx == -1)
                cell.realIdx = cell.idx;

            this.mCurCell.push(cell);
            cell.active = true;
            cell.y = this.mCurYList[i];
        }
        this.mCurCell.sort(function (a, b): number {
            return b.y - a.y;//从大到小排列
        });
    }

    onScrollEvent(scrollView: cc.ScrollView, eventType: cc.ScrollView.EventType, customEventData: string) {
        if (eventType == cc.ScrollView.EventType.SCROLL_BEGAN) {
            this.mScrolling = true;
        } else if (eventType == cc.ScrollView.EventType.SCROLL_ENDED) {
            this.mScrolling = false;
        } else if (eventType == cc.ScrollView.EventType.SCROLLING) {
            this.onChangeContentPos();
        } else if (eventType == cc.ScrollView.EventType.TOUCH_UP) {
            if (!this.mScrolling && this.mLastTouch) {
                for (let i = 0; i < this.mCurCell.length; i++) {
                    let child = this.mCurCell[i];
                    let rect = child.getBoundingBoxToWorld();
                    if (rect.contains(this.mLastTouch.getLocation())) {
                        this.tableCellTouched(this, child, this.mLastTouch);
                        break;
                    }
                }
            }
        }
    }


    onChangeContentPos() {
        let viewY1 = this.scrollView.content.y - this.scrollView.node.height / 2;
        let viewY2 = viewY1 + this.node.height;
        let curY = 0;
        let showBeginI = -1;
        let showEndI = -1;
        for (let i = 0; i < this.mCurYList.length; i++) {
            let curCellH = this.tableCellSizeForIndex(this, i).height;
            if (curY + curCellH < viewY1) {//视口上面
            } else if (curY > viewY2) {//视口下面
                break
            } else {//视口里面
                if (showBeginI == -1)
                    showBeginI = i;
                showEndI = i;
            }
            curY += curCellH;
        }
        if (showBeginI == -1 || showEndI == -1)
            return;
        if (showBeginI >= this.mLastShowBeginI && showEndI <= this.mLastShowEndI) {
            return;//显示的cell区间不变
        }

        let showNewBeginI = showBeginI;
        let showNewEndI = showEndI;
        if (showBeginI < this.mLastShowBeginI) {//手指往下滑动，组件往下滑动，导致当前显示的顶端cell索引小于之前的
            if (showEndI < this.mLastShowEndI) {
                let curEnd = this.mLastShowEndI;
                while (curEnd > showEndI) {
                    if (this.mCurCell.length > 0) {
                        let idle = this.mCurCell.pop();
                        idle.active = false;
                        this.mIdleCell.push(idle);//把最下面的cell推入空闲中
                    }
                    curEnd--;
                }
            }
            showNewEndI = this.mLastShowBeginI - 1;
        } else if (showEndI > this.mLastShowEndI) {//手指往上滑动，组件往上滑动,导致当前显示底段的cell索引大于之前的
            if (showBeginI > this.mLastShowBeginI) {
                let curBegin = this.mLastShowBeginI;
                while (curBegin < showBeginI) {
                    if (this.mCurCell.length > 0) {
                        let idle = this.mCurCell.shift();
                        idle.active = false;
                        this.mIdleCell.push(idle);//把最下面的cell推入空闲中
                    }
                    curBegin++;
                }
            }
            showNewBeginI = this.mLastShowEndI + 1;
        }
        this.mLastShowBeginI = showBeginI;
        this.mLastShowEndI = showEndI;
        for (let i = showNewBeginI; i <= showNewEndI; i++) {
            let cell = this.tableCellAtIndex(this, i);
            cell.idx = i;//更新IDX
            if (!cell.parent) {
                this.scrollView.content.addChild(cell);
            }
            if (cell.realIdx == -1) {
                cell.realIdx = cell.idx;
            }
            this.mCurCell.push(cell);
            cell.active = true;
            cell.y = this.mCurYList[i];
        }
        this.mCurCell.sort(function (a, b): number {
            return b.y - a.y;//从大到小排列
        });
    }

    abstract tableCellAtIndex(table: TableView, idx: number): TableCellNode;
    abstract tableCellSizeForIndex(table: TableView, idx: number): cc.Size;
    abstract numberOfCellsInTableView(table: TableView): number;
    abstract tableCellTouched(table: TableView, cell: TableCellNode, touch: cc.Touch): void;
    abstract getComponentName(): string;
}
