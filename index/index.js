
const device = require('../converter/src/device');
const topology = require('../converter/src/topology');
const etlParser = require('../parser/src/etxParser');
const segParser = require('../parser/src/segParser');
const expParser = require('../parser/src/expParser');

module.exports = {
    converter: {
        device_etl2dev: device.device_etl2dev,
        device_dev2etl: device.device_dev2etl,
        topology_etl2dev: topology.topology_etl2dev,
        topology_dev2etl: topology.topology_dev2etl,
    },
    parser: {
        parse_etl: etlParser.parse,
        parse_seg: segParser.parse,
        parse_exp: expParser.parse,
    }
};

// npx webpack
