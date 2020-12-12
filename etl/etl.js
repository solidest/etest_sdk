//pkg etl.js  --targets node8-win-x64 --out-path ./dist

const parser = require('./parser.js');
const license = require('./license.js');

const {
    program
} = require('commander');

program
    .version('2.0.0', '-v, --version', '显示版本号')
    .helpOption('-h, --help', '显示帮助信息')
    .addHelpCommand('help [command]', '显示命令帮助');

program
    .command('parse <file_etl>')
    .description('解析ETL文件')
    .option('-o --out <path>', '指定输出文件存放位置')
    .option('-d --display', '解析完成后在控制台显示结果')
    .action(function (file_etl, opt) {
        parser.parse(file_etl, opt.out, opt.display);
    });

program
    .command('license <date>')
    .description('生成试用版License')
    .action(function (date) {
        license.maketry(date);
    });

program.parse(process.argv);