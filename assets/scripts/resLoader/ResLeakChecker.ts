
export type FilterCallback = (url: string) => boolean;

export class ResLeakChecker {
    public resFilter: FilterCallback = null;
    private _checking: boolean = false;
    private _log: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

    static findCharPos(str: string, cha: string, num: number): number {
        let x = str.indexOf(cha);
        let ret = x;
        for (var i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
            if (x != -1) {
                ret = x;
            } else {
                return ret;
            }
        }
        return ret;
    }

    static getCallStack(popCount: number): string {
        /*let caller = arguments.callee.caller;
        let count = Math.min(arguments.callee.caller.length - popCount, 10);
        let ret = "";
        do {
            ret = `${ret}${caller.toString()}`;
            caller = caller && caller.caller;
            --count;
        } while (caller && count > 0)*/
        let ret = (new Error()).stack;
        let pos = ResLeakChecker.findCharPos(ret, '\n', popCount);
        if (pos > 0) {
            ret = ret.slice(pos);
        }
        return ret;
    }

    public checkFilter(url: string): boolean {
        if (!this._checking) {
            return false;
        }
        if (this.resFilter) {
            return this.resFilter(url);
        }
        return true;
    }

    public logLoad(url: string, use: string, stack?: string) {
        if (!this.checkFilter(url)) {
            return;
        }
        if (!this._log.has(url)) {
            this._log.set(url, new Map<string, string>());
        }
        let urlInfos: Map<string, string> = this._log.get(url);
        if (urlInfos.has(use)) {
            console.warn(`ResLeakChecker doubel same use ${url} : ${use}, stack ${urlInfos[use]}`);
        }
        urlInfos.set(use, stack ? stack : ResLeakChecker.getCallStack(2));
    }

    public logRelease(url: string, use: string) {
        if (!this.checkFilter(url)) {
            return;
        }
        if (!this._log.has(url)) {
            console.warn(`ResLeakChecker url nofound ${url} : ${use}`);
            return;
        }
        let urlInfos: Map<string, string> = this._log.get(url);
        if (!urlInfos.has(use)) {
            console.warn(`ResLeakChecker use nofound ${url} : ${use}`);
        } else {
            urlInfos.delete(use);
        }
    }

    public startCheck() { this._checking = true; }
    public stopCheck() { this._checking = false; }
    public getLog() { return this._log; }
    public resetLog() {
        this._log = new Map<string, Map<string, string>>();
    }
    public dump() {
        this._log.forEach((log, url) => {
            console.log(url);
            log.forEach((stack, use) => {
                console.log(`${use} : ${stack}`);
            });
        });
    }
}
