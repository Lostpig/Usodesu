let datamap = new Map(),
    recordmap = new Map();

let models = {
    getdata(name) {
        try{
            if(!datamap.has(name)) {
                datamap.set(name, require('./data/' + name));
            }
            return datamap.get(name);
        }
        catch(e) {
            window.error(`can not find data model [${name}]`);
        }
    },
    getrecord(name) {
        try{
            if(!recordmap.has(name)) {
                recordmap.set(name, require('./record/' + name));
            }
            return recordmap.get(name);
        }
        catch(e) {
            window.error(`can not find record model [${name}]`);
        }
    }
}

export default models;
