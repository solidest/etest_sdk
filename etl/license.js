
const chalk = require('chalk');
const msgpack = require('./include/msgpack.min.js')
const fs = require('fs');

const ferr = chalk.bold.red;
const fwar = chalk.keyword('orange');
const fok = chalk.green;
const finfo = chalk.blueBright;
const fcode = chalk.cyanBright;
const fign = chalk.blackBright;

function get_random_num(Min,Max)
{
    let Range = Max - Min;
    let Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}
 function date_format(fmt, t) {
    let ret;
    let date = new Date(t);
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length,
                "0")))
        }
    }
    return fmt;
}

function maketry(date)
{
    try {
        let a = Date.parse(date);
        let b = get_random_num(1000000008975, 1607211078975);
        let msg = {
            a: a - b,
            b
        }
        let buff = msgpack.encode(msg);
        fs.writeFileSync('License', buff, 'binary');
        console.log(fok('License已经生成，试用期至') + ferr(`${date_format('YYYY年mm月dd日', a)}`));
    } catch (err) {
        console.log(ferr(err.message));
    }
}

module.exports = {
    maketry
};
