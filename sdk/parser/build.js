const fs = require("fs");
const path = require("path");

// ETL ////////////////////////////////////////////////////////////////////////////
let lex_main = {
  startConditions: {
    etl: 1,
    lua: 1
  },
  rules: [
    [["etl"], "\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\/", "/*return 'COMMENT_BLOCK'*/"],
    [["etl"], "\\/\\/[^\\r\\n]*", "/*return 'COMMENT_LINE'*/"],
    [["lua"], "--\\[\\[(.|\\r\\n|\\r|\\n)*\\]\\]", "/*return 'COMMENT_BLOCK'*/"],
    [["lua"], "--[^\\n]*", "/*return 'COMMENT_LINE'*/"],
    [["*"], "\\\"([^\\\\\\n\"]|\\\\.)*\\\"", "return 'STRING_TRIPLE'"],
    [["*"], "'([^\\\\\\n']|\\\\.)*'", "return 'STRING_SINGLE'"],
    ["local", "return 'LOCAL'"],
    ["require", "return 'REQUIRE'"],
    ["[a-zA-Z_][a-zA-Z0-9_]*", "return 'ID'"],
    ["<%lua", "this.pushState('lua'); return 'BLOCK_BEGIN_LUA'"],
    ["<%", "this.pushState('etl'); return 'BLOCK_BEGIN_ETL'"],
    [["lua", "etl"], "%>", "this.popState(); return 'BLOCK_END'"],
    ["=", "return '='"],
    ["\\(", "return '('"],
    ["\\)", "return ')'"],
    [["*"], "\\r\\n", "/*return 'NEWLINE'*/"],
    [["*"], "\\n", "/*return 'NEWLINE'*/"],
    [["*"], ".", "/*return 'ANY_OTHER'*/"],
  ],
}

let bnf_main = {
  
  etl: [
    ["etl_element", "$$ = newList($etl_element)"],
    ["etl etl_element", "$$ = joinList($etl, $etl_element)"]
  ],

  etl_element: [
    ["LOCAL ID = REQUIRE ( str )", "$$ = newUsing($str, $ID, @1.startOffset, @7.endOffset)"],
    ["block", "$$ = $block"],
  ],

  block: [
    ["BLOCK_BEGIN_LUA block_body BLOCK_END", "$$ = newBlock('block_lua', @1.startOffset+5, @3.endOffset-2);"],
    ["BLOCK_BEGIN_LUA BLOCK_END", "$$ = newBlock('block_lua', @1.startOffset+5, @2.endOffset-2);"],
    ["BLOCK_BEGIN_ETL block_body BLOCK_END", "$$ = newBlock('block_etx', @1.startOffset+2, @3.endOffset-2);"],
    ["BLOCK_BEGIN_ETL BLOCK_END", "$$ = newBlock('block_etx', @1.startOffset+2, @2.endOffset-2);"],
  ],

  block_body: [
    ["str", ""],
    ["block_body str", ""]
  ],

  str: [
    ["STRING_TRIPLE", "$$ = $1"],
    ["STRING_SINGLE", "$$ = $1"],
  ],
}

let include_main = `

    function newBlock(type, from, to) {
      return { kind: type, from: from, to: to };
    }

    function newUsing(str, id, from, to) {
      return { kind: 'using', ref: eval(str), pkg: id, from: from, to: to };
    }

    function newList(item) {
      return item ? [item] : [];
    }

    function joinList(list, item) {
      if(list && item) {
        list.push(item);
      }
      return list;
    }

`


/* ETL

  build
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etl.g -o sdk/parser/etlParser.js --loc

  语法验证
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etl.g --validate

  不包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli --lex sdk/parser/build/etl_lex.g --tokenize -f test/parsertest/etlTest.etl --loc

  包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etl.g --tokenize -f test/parsertest/etlTest.etl --loc

  语法分析
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etl.g -o sdk/parser/etlParser.js --loc && syntax-cli -m slr1 -g sdk/parser/build/etl.g -f test/parsertest/etlTest.etl --loc
*/





// segtype ////////////////////////////////////////////////////////////////////////////
let lex_segtype = {
  rules: [
    ["uint", "return 'UINT'" ],
    ["int", "return 'INT'" ],
    ["float", "return 'FLOAT'"],
    ["double", "return 'DOUBLE'"],
    ["string", "return 'STRING'"],
    ["(6[0-4])|([1-5][0-9])|([1-9])", "return 'LEN'"],
    [">", "return '>'"],
    ["<", "return '<'"],
    ["!", "return '!'"],
    ["&", "return '&'"],
    ["\\s+", ""],
  ],
}

let bnf_segtype = {

  segtype: [
    ["basetype", "$$ = $basetype;"],
    ["basetype byteorder", "$basetype.order = $byteorder; $$=$basetype;"],
    ["strtype", "$$ = $strtype;"],
    ["strtype byteorder", "$strtype.order = $byteorder; $$=$strtype;"],
    ["basetype encode", "$basetype.encode = $encode; $$=$basetype;"],
    ["basetype byteorder encode", "$basetype.encode = $encode; $basetype.order = $byteorder; $$=$basetype;"],
    ["basetype encode byteorder", "$basetype.encode = $encode; $basetype.order = $byteorder; $$=$basetype;"],
  ],

  basetype: [
    ["INT LEN", "$$ = {type: 'integer', bitcount: eval($LEN), signed: true}"],
    ["UINT LEN", "$$ = {type: 'integer', bitcount: eval($LEN), signed: false}"],
    ["FLOAT", "$$ = {type: 'float'}"],
    ["DOUBLE", "$$ = {type: 'double'}"],
  ],

  strtype: [
    ["STRING", "$$ = {type: 'string'}"],
  ],

  byteorder: [
    [">", "$$ = 'bigorder'"],
    ["<", "$$ = 'smallorder'"],
  ],

  encode: [
    ["&", "$$ = 'complement'"],
    ["!", "$$ = 'inversion'"],
  ]
}

/* segment

  build
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/segtype.g -o sdk/parser/segParser.js --loc

  语法验证
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/segtype.g --validate

  不包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli --lex sdk/parser/build/segtype_lex.g --tokenize -p "int8"

  包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/segtype.g --tokenize -p "double>"

  语法分析
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/segtype.g -o sdk/parser/segParser.js && syntax-cli -m slr1 -g sdk/parser/build/segtype.g -p "string>"
*/



// ETX ////////////////////////////////////////////////////////////////////////////
let lex_etx = {
  rules: [
    ["\\/\\*[^*]*\\*+([^\\/][^*]*\\*+)*\\/", "/*return 'COMMENT_BLOCK'*/" ],
    ["\\/\\/[^\\r\\n]*", "/*return 'COMMENT_LINE'*/"],
    ["\\\"([^\\\\\\n\"]|\\\\.)*\\\"", "return 'STRING_TRIPLE'"],
    ["'([^\\\\\\n']|\\\\.)*'", "return 'STRING_SINGLE'"],
    ["%[0-9A-Fa-f\\s]*%", "return 'STRING_HEX'"],
    ["\\s+", "/* return 'WHITESPACE' */"],
    ["\\n", "/* return 'NEWLINE' */"],
    ["protocol", "return 'PROTOCOL'"],
    ["program", "return 'PROGRAM'"],
    ["segments", "return 'SEGMENTS'"],
    ["segment", "return 'SEGMENT'"],
    ["oneof", "return 'ONEOF'"],
    ["0[xX][0-9a-fA-F]+", "return 'NUMBER_HEX'"],
    ["[0-9]+(?:\\.[0-9]+)?", "return 'NUMBER'"],
    ["[a-zA-Z_$][a-zA-Z0-9_]*", "return 'ID'"],
    ["!=", "return 'NOT_EQ'"],
    ["!", "return 'NOT'"],
    ["==", "return 'EQ_EQ'"],
    [">=", "return 'GT_EQ'"], 
    ["<=", "return 'LT_EQ'"], 
    ["&&", "return 'AND'"],
    ["\\|\\|", "return 'OR'"], 
    ["{", "return '{'"],
    ["}", "return '}'"],
    ["]", "return ']'"],
    ["\\[", "return '['"],
    [",", "return ','"],
    ["\\:", "return ':'"],
    ["\\.", "return 'DOT'"],
    ["\\+", "return '+'"],
    ["-", "return '-'"],
    ["\\*", "return '*'"],
    ["\\/", "return '/'"],
    ["\\(", "return '('"],
    ["\\)", "return ')'"],
    [">", "return '>'"], 
    ["<", "return '<'"],
  ],
}

let bnf_etx = {
  top_element_list: [
    ["top_element", "$$ = newList($top_element);"],
    ["top_element_list top_element", "$$ = joinList($top_element_list, $top_element);"]
  ],

  top_element: [
    ["PROTOCOL ID { }", "newElement('protocol', $ID, 'seglist', null, @ID);"],
    ["PROTOCOL ID { protocol_element_list }", "$$ = newElement('protocol', $ID,'seglist', $protocol_element_list, @ID);"],
    ["PROGRAM ID { }", ""],
    ["PROGRAM ID { program_element_list }", ""],
  ],

  // protocol
  protocol_element_list: [
    ["protocol_element", "$$ = newList($protocol_element);"],
    ["protocol_element_list protocol_element", "$$ = joinList($protocol_element_list, $protocol_element)"]
  ],

  protocol_element: [
    ["SEGMENT ID object_like", "$$ = newElement('segment', $ID, 'props', $object_like, @ID);"],
    ["SEGMENT ID [ exp ] object_like", "$$ = newElement('segment', $ID, 'props', $object_like, @ID, $exp);"],
    ["segments", "$$ = $segments;"],
    ["branch", "$$ = $branch;"],
  ],

  segments: [
    ["SEGMENTS ID { }", "$$ = newProtSeggroup($ID, null, @ID);"],
    ["SEGMENTS ID { protocol_element_list }", "$$ = newProtSeggroup($ID, $protocol_element_list, @ID);"],
    ["SEGMENTS ID [ exp ] { protocol_element_list }", "$$ = newProtSeggroup($ID, $protocol_element_list, @ID, $exp);"],
  ],

  branch: [
    ["ONEOF ( exp ) { }", "$$ = newProtBranch('oneof', $exp, null, @exp);"],
    ["ONEOF ( exp ) { protocol_element_list }", "$$ = newProtBranch('oneof', $exp, $protocol_element_list, @exp);"],
  ],

  // program
  program_element_list: [
    
  ],

  // common
  object_like: [
    ["{ }", "$$ = newList(null);"],
    ["{ property_list }", "$$ = $property_list;"],
  ],

  property_list: [
    ["property_setting", "$$ = newList($property_setting);"],
    ["property_list , property_setting", "$$ = joinList($property_list, $property_setting);"],
    ["property_list ,", "$$ = $property_list;"],
  ],

  property_setting: [
    ["ID : exp", "$$ = newProp($ID, $exp, @ID, @exp);"]
  ],

  exp: [
    ["literal", "$$ = $literal;"],
    ["object_like", "$$ = $object_like;"],
    ["NOT exp", "$$ = {kind: 'not', exp: $exp};"],
    ["- exp", "$$ = {kind: 'uminus', exp: $exp};", { "prec": "UMINUS" }],
    ["exp_compare", "$$ = $exp_compare;"],
    ["exp_calc", "$$ = $exp_calc;"],
    ["exp_bin", "$$ = $exp_bin;"],
    ["( exp )", "$$ = $exp;"],
    ["[ ]", "$$ = newKindList('array', null);"],
    ["[ arrlist ]", "$$ = $arrlist;"],
    ["fn_call", "$$ = $fn_call;"],
  ],

  exp_compare: [
    ["exp NOT_EQ exp", "$$ = {kind: 'not_eq', left: $1, right: $3};"],
    ["exp EQ_EQ exp", "$$ = {kind: 'eq_eq', left: $1, right: $3};"],
    ["exp GT_EQ exp", "$$ = {kind: 'gt_eq', left: $1, right: $3};"],
    ["exp LT_EQ exp", "$$ = {kind: 'lt_eq', left: $1, right: $3};"],
    ["exp > exp", "$$ = {kind: 'gt', left: $1, right: $3};"],
    ["exp < exp", "$$ = {kind: 'lt', left: $1, right: $3};"],
  ],

  exp_bin: [
    ["exp AND exp", "$$ = {kind: 'and', left: $1, right: $3};"],
    ["exp OR exp", "$$ = {kind: 'or', left: $1, right: $3};"],
  ],

  exp_calc: [
    ["exp + exp", "$$ = {kind: 'add', left: $1, right: $3};"],
    ["exp - exp", "$$ = {kind: 'subtract', left: $1, right: $3};"],
    ["exp * exp", "$$ = {kind: 'multiply', left: $1, right: $3};"],
    ["exp / exp", "$$ = {kind: 'divide', left: $1, right: $3};"],
  ],

  fn_call: [
    ["pid ( )", "$$ = {kind: 'fn_call', pname: $pid};"],
    ["pid ( arrlist )", "$$ = {kind: 'fn_call', pname: $pid, args: $arrlist};"],
  ],

  arrlist: [
    ["exp", "$$ = newKindList('array', $exp);"],
    ["arrlist , exp", "$$ = joinKindList($arrlist, $exp);"],
    ["arrlist ,", "$$ = $arrlist;"],
  ],

  literal: [
    ["NUMBER", "$$ = {kind: 'number', value: eval(yytext)};"],
    ["NUMBER_HEX", "$$ = {kind: 'number', value: eval(yytext)};"],
    ["str", "$$ = $str;"],
    ["pid", "$$ = $pid;"],
  ],

  pid: [
    ["ID", "$$ = newKindList('pid', $1);"],
    ["pid DOT ID", "$$ = joinKindList($pid, $ID);"]
  ],

  str: [
    ["STRING_TRIPLE", "$$ = {kind: 'string', value: eval(yytext)};"],
    ["STRING_SINGLE", "$$ = {kind: 'string', value: eval(yytext)};"],
    ["STRING_HEX", "$$ = {kind: 'strhex',  value: yytext.replace(/%/g, '')};"],
  ],

}

let include_etx = `

    function newList(item) {
      if(item) {
        return [item];
      } else {
        return [];
      }
    }

    function joinList(list, item) {
      if(list && item) {
        list.push(item);
      }
      return list;
    }

    function newKindList(kind, item) {
      if(item) {
        return {kind: kind, list: [item]};
      } else {
        return {kind: kind, list: []};
      }
    }

    function joinKindList(list, item) {
      if(list && list.list && item) {
        list.list.push(item);
      }
      return list;
    }

    function newProp(id, exp, id_loc, exp_loc) {
      return {
        kind: 'prop',
        name: id,
        value: exp,
        name_from: id_loc.startOffset,
        name_to: id_loc.endOffset,
        name_line: id_loc.startLine,
        value_from: exp_loc.startOffset,
        value_to: exp_loc.endOffset,
        value_line: exp_loc.startLine,
      }
    }

    function newProtBranch(kind, exp, seglist, exp_loc) {
      return {
        kind: kind,
        exp: exp,
        seglist: seglist,
        exp_from: exp_loc.startOffset,
        exp_to: exp_loc.endOffset,
        exp_line: exp_loc.startLine,
      }
    }

    function newProtSeggroup(name, seglist, name_loc, repeated) {
      let res = {
        kind: 'seggroup',
        name: name,
        seglist: seglist,
        name_from: name_loc.startOffset,
        name_to: name_loc.endOffset,
        name_line: name_loc.startLine,
      }
      if(repeated) {
        res.repeated = repeated;
      }
      return res;
    }

    function newElement(kind, name, body_name, body, name_loc, repeated) {
      let res = {
        kind: kind,
        name: name,
        name_from: name_loc.startOffset,
        name_to: name_loc.endOffset,
        name_line: name_loc.startLine,
      }
      res[body_name] = body;
      if(repeated) {
        res.repeated = repeated;
      }
      return res;
    }


`

let operators = [
  ["left", "AND", "OR"],
  ["left", ">", "<", "GT_EQ", "LT_EQ", "EQ_EQ", "NOT_EQ"],
  ["left", "+", "-"],
  ["left", "*", "/"],
  ["left", "UMINUS", "NOT"],
];

/* ETX

  build
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etx.g -o sdk/parser/etxParser.js --loc

  语法验证
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etx.g --validate

  不包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli --lex sdk/parser/build/etx_lex.g --tokenize -f test/proj_dev_temp/etxTest.etx --loc

  包含语法时的词法检查
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etx.g --tokenize -f test/proj_dev_temp/etxTest.etx --loc

  语法分析
  node sdk/parser/build.js && syntax-cli -m slr1 -g sdk/parser/build/etx.g -o sdk/parser/etxParser.js --loc && syntax-cli -m slr1 -g sdk/parser/build/etx.g -f test/proj_dev_temp/etxTest.etx --loc

*/

fs.writeFileSync(path.join(__dirname, 'build/etl_lex.g'), JSON.stringify(lex_main, null, 4));
fs.writeFileSync(path.join(__dirname, 'build/etl.g'), JSON.stringify({lex: lex_main, bnf: bnf_main, moduleInclude: include_main}, null, 4));
fs.writeFileSync(path.join(__dirname, 'build/etx_lex.g'), JSON.stringify(lex_etx, null, 4));
fs.writeFileSync(path.join(__dirname, 'build/etx.g'), JSON.stringify({lex: lex_etx, operators: operators, bnf: bnf_etx, moduleInclude: include_etx}, null, 4));
fs.writeFileSync(path.join(__dirname, 'build/segtype_lex.g'), JSON.stringify(lex_segtype, null, 4));
fs.writeFileSync(path.join(__dirname, 'build/segtype.g'), JSON.stringify({lex: lex_segtype, bnf: bnf_segtype}, null, 4));



