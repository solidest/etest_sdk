
const device = require('../converter/src/device');
const topology = require('../converter/src/topology');
const protocol = require('../converter/src/protocol');
const etlParser = require('../parser/src/etxParser');
const segParser = require('../parser/src/segParser');
const expParser = require('../parser/src/expParser');

function parseEtl(code) {
    return etlParser.parse(code);
}

function parseSegtype(code) {
    return segParser.parse(code);
}

function parseExp(code) {
    return expParser.parse(code);
}


module.exports = {
    converter: {
        device_etl2dev: device.device_etl2dev,
        device_dev2etl: device.device_dev2etl,
        topology_etl2dev: topology.topology_etl2dev,
        topology_dev2etl: topology.topology_dev2etl,
        protocol_etl2dev: protocol.protocol_etl2dev,
        protocol_dev2etl: protocol.protocol_dev2etl,
    },
    parser: {
        parse_etl: parseEtl,
        parse_seg: parseSegtype,
        parse_exp: parseExp,
    }
};

// npx webpack
