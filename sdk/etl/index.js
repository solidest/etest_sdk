
const protocol = require('./protocol');
const device = require('./device');
const topology = require('./topology');

module.exports = {
    device_etl2dev: device.device_etl2dev,
    device_dev2etl: device.device_dev2etl,
    protocol_etl2dev: protocol.protocol_etl2dev,
    protocol_dev2etl: protocol.protocol_dev2etl,
    topology_etl2dev: topology.topology_etl2dev,
    topology_dev2etl: topology.topology_dev2etl,
};
