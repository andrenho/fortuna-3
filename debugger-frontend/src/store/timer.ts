export default class Timer {

    private static _instance?: Timer = undefined;
    
    private timer: {[k: string] : number} = {};
    private counter: {[k: string] : number} = {};

    private lastTimer = { name: "", startTime: 0 };

    static get instance() : Timer {
        if (Timer._instance === undefined)
            Timer._instance = new Timer();
        return Timer._instance;
    }

    private constructor() {
        
    }

    reset() {
        this.timer = {};
        this.counter = {};
        this.lastTimer = { name: "", startTime: 0 };
    }

    private finalizeLast(now: number) : void {

        if (this.lastTimer.name !== "") {

            if (this.timer[this.lastTimer.name] === undefined) {
                this.timer[this.lastTimer.name] = 0;
                this.counter[this.lastTimer.name] = 0;
            }

            this.timer[this.lastTimer.name] += (now - this.lastTimer.startTime);
            ++this.counter[this.lastTimer.name];

        }

    }

    start(name: string) : void {

        const now = performance.now();

        // finalize last
        this.finalizeLast(now);

        // initialize new
        this.lastTimer = { name, startTime: now };

    }

    report() : void {
        this.finalizeLast(performance.now());

        console.log("Timer report:");
        for (const name of (Object.keys(this.timer))) {
            console.log(name, this.timer[name] / this.counter[name]);
        }
        console.log("----------------");
    }

}