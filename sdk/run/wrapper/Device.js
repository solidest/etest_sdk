
import helper from '../../helper/helper';

class Device {
    constructor(data, proj, name) {
        this.data = helper.deep_copy(data);
        this.proj = proj;
        this.name = name;
    }

    get id() {
        return this.data.id;
    }

    get items() {
        if(!this.data.content) {
            return [];
        }
        return this.data.content.items || [];
    }

    get connectors() {
        if(!this.data.content) {
            return [];
        }
        return this.data.content.items || [];
    }
}

export default Device;