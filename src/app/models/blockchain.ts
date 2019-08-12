export class Blockchain {
    _id?: number;
    name: string;
    desc?: string;
    testApis: string[];
    apis: string[];

    constructor(name: string, desc: string, apis?: string[], testApis?: string[]) {
        this.name = name;
        this.desc = desc;

        if (apis) {
            this.apis = apis;
        }

        if (testApis) {
            this.testApis = testApis;
        }
    }

    addApi(api: string, isTest: boolean = false) {
        if (isTest) {
            if (!this.testApis) { this.testApis = new Array(); }
            if (this.testApis.indexOf(api) < 0) {
                this.testApis.push(api);
            }
        } else {
            if (!this.apis) { this.apis = new Array(); }
            if (this.apis.indexOf(api) < 0) {
                this.apis.push(api);
            }
        }
    }
}
