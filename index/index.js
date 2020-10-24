
const device = require('../converter/src/device');
const etlParser = require('../parser/src/etxParser');

function parseEtl(code) {
    return etlParser.parse(code);
}

module.exports = {
    converter: {
        device_etl2dev: device.device_etl2dev,
        device_dev2etl: device.device_dev2etl,        
    },
    parser: {
        parse_etl: parseEtl,
    }
};

// npx webpack
