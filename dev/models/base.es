let { log, error, warn } = window;

class BaseModel {
    constructor() {
        this.modelname = 'base';
        this.map = new Map();
        this.dependency = [];
        this.loaded = false;

        this[Symbol.iterator] = this.map[Symbol.iterator];
    }
    addDependency (dep) {
        this.dependency.push(dep);
    }
    checkDependency () {
        let hasAllLoaded = true;
        for (let dep of this.dependency) {
            if(!dep.loaded) {
                error(`${dep.modelname} not loaded, can't load ${this.modelname}`);
                hasAllLoaded = false;
            }
        }
        return hasAllLoaded;
    }
    update (api_obj) {
        if (!this.checkDependency()) { return; }
        if(api_obj instanceof Array) {
            for(let [index, item] of api_obj.entries()) {
                this.set(item, index);
            }
        }
        else {
            for(let key of Object.keys(api_obj)) {
                this.set(api_obj[key], key);
            }
        }
        this.loaded = true;
    }
    set(item, index) {
        try {
            let parseItem = this.parse(item, index);
            if (parseItem !== false) {
                if(parseItem.id) {
                    this.map.set(parseItem.id, parseItem);
                }
                else {
                    this.map.set(index, parseItem);
                }
            }
        }
        catch(e) {
            error(`[${this.modelname} ERROR]:${e}`);
        }
    }
    get (key) {
        return this.map.get(key);
    }
    delete (key) {
        this.map.delete(key);
    }
    find (key, val) {
        let finditem = null;
        for (let item of this.map.values()) {
            if(item[key] === val) {
                finditem = item; break;
            }
        }
        return finditem;
    }
    filter (key, val) {
        let findArr = [];
        for (let item of this.map.values()) {
            if(item[key] === val) {
                findArr.push(item);
            }
        }
        return finditem;
    }
    has (key) {
        return this.map.has(key);
    }
    get size() {
        return this.map.size;
    }
}

export default BaseModel;
