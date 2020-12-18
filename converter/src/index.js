
const protocol = require('./protocol');
const device = require('./device');
const topology = require('./topology');
const makeout = require('./makeout');
const program = require('./program');

module.exports = {
    device_etl2dev: device.device_etl2dev,          // 设备脚本->设备对象
    device_dev2etl: device.device_dev2etl,          // 设备对象->设备脚本
    topology_etl2dev: topology.topology_etl2dev,    // 拓扑脚本->拓扑对象
    topology_dev2etl: topology.topology_dev2etl,    // 拓扑对象->拓扑脚本
    protocol_etl2dev: protocol.protocol_etl2dev,    // 协议脚本->协议对象
    protocol_dev2etl: protocol.protocol_dev2etl,    // 协议对象->协议脚本
    makeout_protocol: makeout.make_prot,            // 协议对象->执行对象

    program_tree_etl2dev: program.program_tree_etl2dev,
    program_runs_etl2dev: program.program_runs_etl2dev,
    program_runs_dev2etl: program.program_runs_dev2etl,
    // makeout_dev2env: makeout.makeout_dev2env,
    // makeout_etl2run: makeout.makeout_etl2run,
};
