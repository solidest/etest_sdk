#!/usr/bin/env node

/**
 * ETL命令行执行入口模块
 */

const { program } = require('commander');

function _get_idxfile() {
    let idxfile = program.idxfile;
    if(!idxfile) {
        return 'index.yml';
    } 
    return idxfile;
}

program
    .option('-i, --idxfile <file>', 'specify index file')
    .option('-r, --realtime', 'work on real time mode');

//state
program
    .command('state')
    .description('query status of etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_state(_get_idxfile());
    });

//stop
program
    .command('stop')
    .description('stop run on etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_stop(_get_idxfile());
    });

//setup
program
    .command('setup')
    .description('setup environment into etestx')
    .action(()=>{
        const cmd = require('./command');
        cmd.cmd_setup(_get_idxfile());
    });


//run
program
    .command('run <run_id>')
    .description('run special case on etestx')
    .action((run_id)=>{
        const cmd = require('./command');
        cmd.cmd_run(_get_idxfile(), run_id);
    });

program.parse(process.argv);




