
import * as std from 'std';
import parser from './etxParser.js';

try {
    let len = scriptArgs.length;
    let ast = null;
    if(len > 1) {
        let code = std.loadFile(scriptArgs[1]);
        ast = parser.parse(code);
    }
    if(ast) {
        if(len > 2) {
            let file = std.open(scriptArgs[2],'w');
            file.puts(JSON.stringify(ast));
            file.close();
        } else {
            console.log(JSON.stringify(ast, null, 4))
        }        
    } else {
        console.log("null")
    }
} catch (e)  {
    console.log(e.message)
}

