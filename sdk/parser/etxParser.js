/**
 * LR parser generated by the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 *   npm install -g syntax-cli
 *
 *   syntax-cli --help
 *
 * To regenerate run:
 *
 *   syntax-cli \
 *     --grammar ~/path-to-grammar-file \
 *     --mode <parsing-mode> \
 *     --output ~/path-to-output-parser-file.js
 */

'use strict';

/**
 * Matched token text.
 */
let yytext;

/**
 * Length of the matched token text.
 */
let yyleng;

/**
 * Storage object.
 */
let yy = {};

/**
 * Result of semantic action.
 */
let __;

/**
 * Result location object.
 */
let __loc;

function yyloc(start, end) {
  if (!yy.options.captureLocations) {
    return null;
  }

  // Epsilon doesn't produce location.
  if (!start || !end) {
    return start || end;
  }

  return {
    startOffset: start.startOffset,
    endOffset: end.endOffset,
    startLine: start.startLine,
    endLine: end.endLine,
    startColumn: start.startColumn,
    endColumn: end.endColumn,
  };
}

const EOF = '$';

/**
 * List of productions (generated by Syntax tool).
 */
const productions = [[-1,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1 }],
[0,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[0,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = joinList(_1, _2); }],
[1,4,(_1,_2,_3,_4,_1loc,_2loc,_3loc,_4loc) => { __loc = yyloc(_1loc, _4loc);newElement('protocol', _2, 'seglist', null, _2loc); }],
[1,5,(_1,_2,_3,_4,_5,_1loc,_2loc,_3loc,_4loc,_5loc) => { __loc = yyloc(_1loc, _5loc);__ = newElement('protocol', _2,'seglist', _4, _2loc); }],
[1,4],
[1,5],
[2,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[2,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = joinList(_1, _2) }],
[3,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = newElement('segment', _2, 'props', _3, _2loc); }],
[3,6,(_1,_2,_3,_4,_5,_6,_1loc,_2loc,_3loc,_4loc,_5loc,_6loc) => { __loc = yyloc(_1loc, _6loc);__ = newElement('segment', _2, 'props', _6, _2loc, _4); }],
[3,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[3,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[4,4,(_1,_2,_3,_4,_1loc,_2loc,_3loc,_4loc) => { __loc = yyloc(_1loc, _4loc);__ = newProtSeggroup(_2, null, _2loc); }],
[4,5,(_1,_2,_3,_4,_5,_1loc,_2loc,_3loc,_4loc,_5loc) => { __loc = yyloc(_1loc, _5loc);__ = newProtSeggroup(_2, _4, _2loc); }],
[4,8,(_1,_2,_3,_4,_5,_6,_7,_8,_1loc,_2loc,_3loc,_4loc,_5loc,_6loc,_7loc,_8loc) => { __loc = yyloc(_1loc, _8loc);__ = newProtSeggroup(_2, _7, _2loc, _4); }],
[5,6,(_1,_2,_3,_4,_5,_6,_1loc,_2loc,_3loc,_4loc,_5loc,_6loc) => { __loc = yyloc(_1loc, _6loc);__ = newProtBranch('oneof', _3, null, _3loc); }],
[5,7,(_1,_2,_3,_4,_5,_6,_7,_1loc,_2loc,_3loc,_4loc,_5loc,_6loc,_7loc) => { __loc = yyloc(_1loc, _7loc);__ = newProtBranch('oneof', _3, _6, _3loc); }],
[6,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = newList(null); }],
[6,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[7,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[7,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinList(_1, _3); }],
[7,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[8,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = newProp(_1, _3, _1loc, _3loc); }],
[9,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[9,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[9,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = {kind: 'not', exp: _2}; }],
[9,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = {kind: 'uminus', exp: _2}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'not_eq', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'eq_eq', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'gt_eq', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'lt_eq', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'gt', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'lt', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'add', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'subtract', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'multiply', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'divide', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'and', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = {kind: 'or', left: _1, right: _3}; }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[9,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = newKindList('array', null); }],
[9,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = _2; }],
[9,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[10,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = { kind: _1 }; }],
[10,4,(_1,_2,_3,_4,_1loc,_2loc,_3loc,_4loc) => { __loc = yyloc(_1loc, _4loc);__ = {kind: _1, params: _3}; }],
[11,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newList(_1); }],
[11,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinList(_1, _3); }],
[11,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[12,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newKindList('array', _1); }],
[12,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinKindList(_1, _3); }],
[12,2,(_1,_2,_1loc,_2loc) => { __loc = yyloc(_1loc, _2loc);__ = _1; }],
[13,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'number', value: eval(yytext)}; }],
[13,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'number', value: eval(yytext)}; }],
[13,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[13,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = _1; }],
[14,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = newKindList('pid', _1); }],
[14,3,(_1,_2,_3,_1loc,_2loc,_3loc) => { __loc = yyloc(_1loc, _3loc);__ = joinKindList(_1, _3); }],
[15,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'string', value: eval(yytext)}; }],
[15,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'string', value: eval(yytext)}; }],
[15,1,(_1,_1loc) => { __loc = yyloc(_1loc, _1loc);__ = {kind: 'strhex',  value: yytext.replace(/%/g, '')}; }]];

/**
 * Encoded tokens map.
 */
const tokens = {"PROTOCOL":"16","ID":"17","{":"18","}":"19","PROGRAM":"20","program_element_list":"21","SEGMENT":"22","[":"23","]":"24","SEGMENTS":"25","ONEOF":"26","(":"27",")":"28",",":"29",":":"30","NOT":"31","-":"32","NOT_EQ":"33","EQ_EQ":"34","GT_EQ":"35","LT_EQ":"36",">":"37","<":"38","+":"39","*":"40","/":"41","AND":"42","OR":"43","NUMBER":"44","NUMBER_HEX":"45","DOT":"46","STRING_TRIPLE":"47","STRING_SINGLE":"48","STRING_HEX":"49","$":"50"};

/**
 * Parsing table (generated by Syntax tool).
 */
const table = [{"0":1,"1":2,"16":"s3","20":"s4"},{"1":5,"16":"s3","20":"s4","50":"acc"},{"16":"r1","20":"r1","50":"r1"},{"17":"s6"},{"17":"s110"},{"16":"r2","20":"r2","50":"r2"},{"18":"s7"},{"2":9,"3":10,"4":12,"5":13,"19":"s8","22":"s11","25":"s14","26":"s15"},{"16":"r3","20":"r3","50":"r3"},{"3":17,"4":12,"5":13,"19":"s16","22":"s11","25":"s14","26":"s15"},{"19":"r7","22":"r7","25":"r7","26":"r7"},{"17":"s18"},{"19":"r11","22":"r11","25":"r11","26":"r11"},{"19":"r12","22":"r12","25":"r12","26":"r12"},{"17":"s92"},{"27":"s98"},{"16":"r4","20":"r4","50":"r4"},{"19":"r8","22":"r8","25":"r8","26":"r8"},{"6":19,"18":"s21","23":"s20"},{"19":"r9","22":"r9","25":"r9","26":"r9"},{"6":24,"9":22,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"7":53,"8":54,"17":"s55","19":"s52"},{"24":"s38","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"19":"r24","24":"r24","28":"r24","29":"r24","32":"r24","33":"r24","34":"r24","35":"r24","36":"r24","37":"r24","38":"r24","39":"r24","40":"r24","41":"r24","42":"r24","43":"r24"},{"19":"r25","24":"r25","28":"r25","29":"r25","32":"r25","33":"r25","34":"r25","35":"r25","36":"r25","37":"r25","38":"r25","39":"r25","40":"r25","41":"r25","42":"r25","43":"r25"},{"6":24,"9":73,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":74,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":75,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":79,"10":29,"12":78,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","24":"s77","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"19":"r43","24":"r43","28":"r43","29":"r43","32":"r43","33":"r43","34":"r43","35":"r43","36":"r43","37":"r43","38":"r43","39":"r43","40":"r43","41":"r43","42":"r43","43":"r43"},{"19":"r52","24":"r52","28":"r52","29":"r52","32":"r52","33":"r52","34":"r52","35":"r52","36":"r52","37":"r52","38":"r52","39":"r52","40":"r52","41":"r52","42":"r52","43":"r52"},{"19":"r53","24":"r53","28":"r53","29":"r53","32":"r53","33":"r53","34":"r53","35":"r53","36":"r53","37":"r53","38":"r53","39":"r53","40":"r53","41":"r53","42":"r53","43":"r53"},{"19":"r54","24":"r54","28":"r54","29":"r54","32":"r54","33":"r54","34":"r54","35":"r54","36":"r54","37":"r54","38":"r54","39":"r54","40":"r54","41":"r54","42":"r54","43":"r54"},{"19":"r55","24":"r55","28":"r55","29":"r55","32":"r55","33":"r55","34":"r55","35":"r55","36":"r55","37":"r55","38":"r55","39":"r55","40":"r55","41":"r55","42":"r55","43":"r55","46":"s83"},{"19":"r58","24":"r58","28":"r58","29":"r58","32":"r58","33":"r58","34":"r58","35":"r58","36":"r58","37":"r58","38":"r58","39":"r58","40":"r58","41":"r58","42":"r58","43":"r58"},{"19":"r59","24":"r59","28":"r59","29":"r59","32":"r59","33":"r59","34":"r59","35":"r59","36":"r59","37":"r59","38":"r59","39":"r59","40":"r59","41":"r59","42":"r59","43":"r59"},{"19":"r60","24":"r60","28":"r60","29":"r60","32":"r60","33":"r60","34":"r60","35":"r60","36":"r60","37":"r60","38":"r60","39":"r60","40":"r60","41":"r60","42":"r60","43":"r60"},{"19":"r56","24":"r56","27":"s85","28":"r56","29":"r56","32":"r56","33":"r56","34":"r56","35":"r56","36":"r56","37":"r56","38":"r56","39":"r56","40":"r56","41":"r56","42":"r56","43":"r56","46":"r56"},{"6":51,"18":"s21"},{"6":24,"9":61,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":62,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":63,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":64,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":65,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":66,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":67,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":68,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":69,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":70,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":71,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"6":24,"9":72,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"19":"r10","22":"r10","25":"r10","26":"r10"},{"19":"r18","22":"r18","24":"r18","25":"r18","26":"r18","28":"r18","29":"r18","32":"r18","33":"r18","34":"r18","35":"r18","36":"r18","37":"r18","38":"r18","39":"r18","40":"r18","41":"r18","42":"r18","43":"r18"},{"19":"s56","29":"s57"},{"19":"r20","29":"r20"},{"30":"s59"},{"19":"r19","22":"r19","24":"r19","25":"r19","26":"r19","28":"r19","29":"r19","32":"r19","33":"r19","34":"r19","35":"r19","36":"r19","37":"r19","38":"r19","39":"r19","40":"r19","41":"r19","42":"r19","43":"r19"},{"8":58,"17":"s55","19":"r22","29":"r22"},{"19":"r21","29":"r21"},{"6":24,"9":60,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"19":"r23","29":"r23","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"19":"r28","24":"r28","28":"r28","29":"r28","32":"s46","33":"r28","34":"r28","35":"r28","36":"r28","37":"r28","38":"r28","39":"s45","40":"s47","41":"s48","42":"r28","43":"r28"},{"19":"r29","24":"r29","28":"r29","29":"r29","32":"s46","33":"r29","34":"r29","35":"r29","36":"r29","37":"r29","38":"r29","39":"s45","40":"s47","41":"s48","42":"r29","43":"r29"},{"19":"r30","24":"r30","28":"r30","29":"r30","32":"s46","33":"r30","34":"r30","35":"r30","36":"r30","37":"r30","38":"r30","39":"s45","40":"s47","41":"s48","42":"r30","43":"r30"},{"19":"r31","24":"r31","28":"r31","29":"r31","32":"s46","33":"r31","34":"r31","35":"r31","36":"r31","37":"r31","38":"r31","39":"s45","40":"s47","41":"s48","42":"r31","43":"r31"},{"19":"r32","24":"r32","28":"r32","29":"r32","32":"s46","33":"r32","34":"r32","35":"r32","36":"r32","37":"r32","38":"r32","39":"s45","40":"s47","41":"s48","42":"r32","43":"r32"},{"19":"r33","24":"r33","28":"r33","29":"r33","32":"s46","33":"r33","34":"r33","35":"r33","36":"r33","37":"r33","38":"r33","39":"s45","40":"s47","41":"s48","42":"r33","43":"r33"},{"19":"r34","24":"r34","28":"r34","29":"r34","32":"r34","33":"r34","34":"r34","35":"r34","36":"r34","37":"r34","38":"r34","39":"r34","40":"s47","41":"s48","42":"r34","43":"r34"},{"19":"r35","24":"r35","28":"r35","29":"r35","32":"r35","33":"r35","34":"r35","35":"r35","36":"r35","37":"r35","38":"r35","39":"r35","40":"s47","41":"s48","42":"r35","43":"r35"},{"19":"r36","24":"r36","28":"r36","29":"r36","32":"r36","33":"r36","34":"r36","35":"r36","36":"r36","37":"r36","38":"r36","39":"r36","40":"r36","41":"r36","42":"r36","43":"r36"},{"19":"r37","24":"r37","28":"r37","29":"r37","32":"r37","33":"r37","34":"r37","35":"r37","36":"r37","37":"r37","38":"r37","39":"r37","40":"r37","41":"r37","42":"r37","43":"r37"},{"19":"r38","24":"r38","28":"r38","29":"r38","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"r38","43":"r38"},{"19":"r39","24":"r39","28":"r39","29":"r39","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"r39","43":"r39"},{"19":"r26","24":"r26","28":"r26","29":"r26","32":"r26","33":"r26","34":"r26","35":"r26","36":"r26","37":"r26","38":"r26","39":"r26","40":"r26","41":"r26","42":"r26","43":"r26"},{"19":"r27","24":"r27","28":"r27","29":"r27","32":"r27","33":"r27","34":"r27","35":"r27","36":"r27","37":"r27","38":"r27","39":"r27","40":"r27","41":"r27","42":"r27","43":"r27"},{"28":"s76","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"19":"r40","24":"r40","28":"r40","29":"r40","32":"r40","33":"r40","34":"r40","35":"r40","36":"r40","37":"r40","38":"r40","39":"r40","40":"r40","41":"r40","42":"r40","43":"r40"},{"19":"r41","24":"r41","28":"r41","29":"r41","32":"r41","33":"r41","34":"r41","35":"r41","36":"r41","37":"r41","38":"r41","39":"r41","40":"r41","41":"r41","42":"r41","43":"r41"},{"24":"s80","29":"s81"},{"24":"r49","29":"r49","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"19":"r42","24":"r42","28":"r42","29":"r42","32":"r42","33":"r42","34":"r42","35":"r42","36":"r42","37":"r42","38":"r42","39":"r42","40":"r42","41":"r42","42":"r42","43":"r42"},{"6":24,"9":82,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","24":"r51","27":"s27","29":"r51","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"24":"r50","29":"r50","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"17":"s84"},{"19":"r57","24":"r57","28":"r57","29":"r57","32":"r57","33":"r57","34":"r57","35":"r57","36":"r57","37":"r57","38":"r57","39":"r57","40":"r57","41":"r57","42":"r57","43":"r57","46":"r57"},{"6":24,"9":88,"10":29,"11":87,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","28":"s86","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"19":"r44","24":"r44","28":"r44","29":"r44","32":"r44","33":"r44","34":"r44","35":"r44","36":"r44","37":"r44","38":"r44","39":"r44","40":"r44","41":"r44","42":"r44","43":"r44"},{"28":"s89","29":"s90"},{"28":"r46","29":"r46","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"19":"r45","24":"r45","28":"r45","29":"r45","32":"r45","33":"r45","34":"r45","35":"r45","36":"r45","37":"r45","38":"r45","39":"r45","40":"r45","41":"r45","42":"r45","43":"r45"},{"6":24,"9":91,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","28":"r48","29":"r48","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"28":"r47","29":"r47","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"18":"s93","23":"s94"},{"2":96,"3":10,"4":12,"5":13,"19":"s95","22":"s11","25":"s14","26":"s15"},{"6":24,"9":105,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"19":"r13","22":"r13","25":"r13","26":"r13"},{"3":17,"4":12,"5":13,"19":"s97","22":"s11","25":"s14","26":"s15"},{"19":"r14","22":"r14","25":"r14","26":"r14"},{"6":24,"9":99,"10":29,"13":23,"14":33,"15":32,"17":"s37","18":"s21","23":"s28","27":"s27","31":"s25","32":"s26","44":"s30","45":"s31","47":"s34","48":"s35","49":"s36"},{"28":"s100","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"18":"s101"},{"2":103,"3":10,"4":12,"5":13,"19":"s102","22":"s11","25":"s14","26":"s15"},{"19":"r16","22":"r16","25":"r16","26":"r16"},{"3":17,"4":12,"5":13,"19":"s104","22":"s11","25":"s14","26":"s15"},{"19":"r17","22":"r17","25":"r17","26":"r17"},{"24":"s106","32":"s46","33":"s39","34":"s40","35":"s41","36":"s42","37":"s43","38":"s44","39":"s45","40":"s47","41":"s48","42":"s49","43":"s50"},{"18":"s107"},{"2":108,"3":10,"4":12,"5":13,"22":"s11","25":"s14","26":"s15"},{"3":17,"4":12,"5":13,"19":"s109","22":"s11","25":"s14","26":"s15"},{"19":"r15","22":"r15","25":"r15","26":"r15"},{"18":"s111"},{"19":"s112","21":"s113"},{"16":"r5","20":"r5","50":"r5"},{"19":"s114"},{"16":"r6","20":"r6","50":"r6"}];

/**
 * Parsing stack.
 */
const stack = [];

/**
 * Tokenizer instance.
 */
let tokenizer;
/**
 * Generic tokenizer used by the parser in the Syntax tool.
 *
 * https://www.npmjs.com/package/syntax-cli
 *
 * See `--custom-tokinzer` to skip this generation, and use a custom one.
 */

const lexRules = [[/^\/\*[^*]*\*+([^\/][^*]*\*+)*\//, function() { /*return 'COMMENT_BLOCK'*/ }],
[/^\/\/[^\r\n]*/, function() { /*return 'COMMENT_LINE'*/ }],
[/^\"([^\\\n"]|\\.)*\"/, function() { return 'STRING_TRIPLE' }],
[/^'([^\\\n']|\\.)*'/, function() { return 'STRING_SINGLE' }],
[/^%[0-9A-Fa-f\s]*%/, function() { return 'STRING_HEX' }],
[/^\s+/, function() { /* return 'WHITESPACE' */ }],
[/^\n/, function() { /* return 'NEWLINE' */ }],
[/^protocol/, function() { return 'PROTOCOL' }],
[/^program/, function() { return 'PROGRAM' }],
[/^segments/, function() { return 'SEGMENTS' }],
[/^segment/, function() { return 'SEGMENT' }],
[/^oneof/, function() { return 'ONEOF' }],
[/^0[xX][0-9a-fA-F]+/, function() { return 'NUMBER_HEX' }],
[/^[0-9]+(?:\.[0-9]+)?/, function() { return 'NUMBER' }],
[/^[a-zA-Z_$][a-zA-Z0-9_]*/, function() { return 'ID' }],
[/^!=/, function() { return 'NOT_EQ' }],
[/^!/, function() { return 'NOT' }],
[/^==/, function() { return 'EQ_EQ' }],
[/^>=/, function() { return 'GT_EQ' }],
[/^<=/, function() { return 'LT_EQ' }],
[/^&&/, function() { return 'AND' }],
[/^\|\|/, function() { return 'OR' }],
[/^{/, function() { return '{' }],
[/^}/, function() { return '}' }],
[/^]/, function() { return ']' }],
[/^\[/, function() { return '[' }],
[/^,/, function() { return ',' }],
[/^\:/, function() { return ':' }],
[/^\./, function() { return 'DOT' }],
[/^\+/, function() { return '+' }],
[/^-/, function() { return '-' }],
[/^\*/, function() { return '*' }],
[/^\//, function() { return '/' }],
[/^\(/, function() { return '(' }],
[/^\)/, function() { return ')' }],
[/^>/, function() { return '>' }],
[/^</, function() { return '<' }]];
const lexRulesByConditions = {"INITIAL":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]};

const EOF_TOKEN = {
  type: EOF,
  value: '',
};

tokenizer = {
  initString(string) {
    this._string = string;
    this._cursor = 0;

    this._states = ['INITIAL'];
    this._tokensQueue = [];

    this._currentLine = 1;
    this._currentColumn = 0;
    this._currentLineBeginOffset = 0;

    /**
     * Matched token location data.
     */
    this._tokenStartOffset = 0;
    this._tokenEndOffset = 0;
    this._tokenStartLine = 1;
    this._tokenEndLine = 1;
    this._tokenStartColumn = 0;
    this._tokenEndColumn = 0;

    return this;
  },

  /**
   * Returns tokenizer states.
   */
  getStates() {
    return this._states;
  },

  getCurrentState() {
    return this._states[this._states.length - 1];
  },

  pushState(state) {
    this._states.push(state);
  },

  begin(state) {
    this.pushState(state);
  },

  popState() {
    if (this._states.length > 1) {
      return this._states.pop();
    }
    return this._states[0];
  },

  getNextToken() {
    // Something was queued, return it.
    if (this._tokensQueue.length > 0) {
      return this.onToken(this._toToken(this._tokensQueue.shift()));
    }

    if (!this.hasMoreTokens()) {
      return this.onToken(EOF_TOKEN);
    }

    let string = this._string.slice(this._cursor);
    let lexRulesForState = lexRulesByConditions[this.getCurrentState()];

    for (let i = 0; i < lexRulesForState.length; i++) {
      let lexRuleIndex = lexRulesForState[i];
      let lexRule = lexRules[lexRuleIndex];

      let matched = this._match(string, lexRule[0]);

      // Manual handling of EOF token (the end of string). Return it
      // as `EOF` symbol.
      if (string === '' && matched === '') {
        this._cursor++;
      }

      if (matched !== null) {
        yytext = matched;
        yyleng = yytext.length;
        let token = lexRule[1].call(this);

        if (!token) {
          return this.getNextToken();
        }

        // If multiple tokens are returned, save them to return
        // on next `getNextToken` call.

        if (Array.isArray(token)) {
          const tokensToQueue = token.slice(1);
          token = token[0];
          if (tokensToQueue.length > 0) {
            this._tokensQueue.unshift(...tokensToQueue);
          }
        }

        return this.onToken(this._toToken(token, yytext));
      }
    }

    if (this.isEOF()) {
      this._cursor++;
      return EOF_TOKEN;
    }

    this.throwUnexpectedToken(
      string[0],
      this._currentLine,
      this._currentColumn
    );
  },

  /**
   * Throws default "Unexpected token" exception, showing the actual
   * line from the source, pointing with the ^ marker to the bad token.
   * In addition, shows `line:column` location.
   */
  throwUnexpectedToken(symbol, line, column) {
    const lineSource = this._string.split('\n')[line - 1];
    let lineData = '';

    if (lineSource) {
      const pad = ' '.repeat(column);
      lineData = '\n\n' + lineSource + '\n' + pad + '^\n';
    }

    throw new SyntaxError(
      `${lineData}Unexpected token: "${symbol}" ` +
      `at ${line}:${column}.`
    );
  },

  getCursor() {
    return this._cursor;
  },

  getCurrentLine() {
    return this._currentLine;
  },

  getCurrentColumn() {
    return this._currentColumn;
  },

  _captureLocation(matched) {
    const nlRe = /\n/g;

    // Absolute offsets.
    this._tokenStartOffset = this._cursor;

    // Line-based locations, start.
    this._tokenStartLine = this._currentLine;
    this._tokenStartColumn =
      this._tokenStartOffset - this._currentLineBeginOffset;

    // Extract `\n` in the matched token.
    let nlMatch;
    while ((nlMatch = nlRe.exec(matched)) !== null) {
      this._currentLine++;
      this._currentLineBeginOffset = this._tokenStartOffset + nlMatch.index + 1;
    }

    this._tokenEndOffset = this._cursor + matched.length;

    // Line-based locations, end.
    this._tokenEndLine = this._currentLine;
    this._tokenEndColumn = this._currentColumn =
      (this._tokenEndOffset - this._currentLineBeginOffset);
  },

  _toToken(tokenType, yytext = '') {
    return {
      // Basic data.
      type: tokenType,
      value: yytext,

      // Location data.
      startOffset: this._tokenStartOffset,
      endOffset: this._tokenEndOffset,
      startLine: this._tokenStartLine,
      endLine: this._tokenEndLine,
      startColumn: this._tokenStartColumn,
      endColumn: this._tokenEndColumn,
    };
  },

  isEOF() {
    return this._cursor === this._string.length;
  },

  hasMoreTokens() {
    return this._cursor <= this._string.length;
  },

  _match(string, regexp) {
    let matched = string.match(regexp);
    if (matched) {
      // Handle `\n` in the matched token to track line numbers.
      this._captureLocation(matched[0]);
      this._cursor += matched[0].length;
      return matched[0];
    }
    return null;
  },

  /**
   * Allows analyzing, and transforming token. Default implementation
   * just passes the token through.
   */
  onToken(token) {
    return token;
  },
};

/**
 * Expose tokenizer so it can be accessed in semantic actions.
 */
yy.lexer = tokenizer;
yy.tokenizer = tokenizer;

/**
 * Global parsing options. Some options can be shadowed per
 * each `parse` call, if the optations are passed.
 *
 * Initalized to the `captureLocations` which is passed
 * from the generator. Other options can be added at runtime.
 */
yy.options = {
  captureLocations: true,
};

/**
 * Parsing module.
 */
const yyparse = {
  /**
   * Sets global parsing options.
   */
  setOptions(options) {
    yy.options = options;
    return this;
  },

  /**
   * Returns parsing options.
   */
  getOptions() {
    return yy.options;
  },

  /**
   * Parses a string.
   */
  parse(string, parseOptions) {
    if (!tokenizer) {
      throw new Error(`Tokenizer instance wasn't specified.`);
    }

    tokenizer.initString(string);

    /**
     * If parse options are passed, override global parse options for
     * this call, and later restore global options.
     */
    let globalOptions = yy.options;
    if (parseOptions) {
      yy.options = Object.assign({}, yy.options, parseOptions);
    }

    /**
     * Allow callers to do setup work based on the
     * parsing string, and passed options.
     */
    yyparse.onParseBegin(string, tokenizer, yy.options);

    stack.length = 0;
    stack.push(0);

    let token = tokenizer.getNextToken();
    let shiftedToken = null;

    do {
      if (!token) {
        // Restore options.
        yy.options = globalOptions;
        unexpectedEndOfInput();
      }

      let state = stack[stack.length - 1];
      let column = tokens[token.type];

      if (!table[state].hasOwnProperty(column)) {
        yy.options = globalOptions;
        unexpectedToken(token);
      }

      let entry = table[state][column];

      // Shift action.
      if (entry[0] === 's') {
        let loc = null;

        if (yy.options.captureLocations) {
          loc = {
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            startLine: token.startLine,
            endLine: token.endLine,
            startColumn: token.startColumn,
            endColumn: token.endColumn,
          };
        }

        shiftedToken = this.onShift(token);

        stack.push(
          {symbol: tokens[shiftedToken.type], semanticValue: shiftedToken.value, loc},
          Number(entry.slice(1))
        );

        token = tokenizer.getNextToken();
      }

      // Reduce action.
      else if (entry[0] === 'r') {
        let productionNumber = entry.slice(1);
        let production = productions[productionNumber];
        let hasSemanticAction = typeof production[2] === 'function';
        let semanticValueArgs = hasSemanticAction ? [] : null;

        const locationArgs = (
          hasSemanticAction && yy.options.captureLocations
            ? []
            : null
        );

        if (production[1] !== 0) {
          let rhsLength = production[1];
          while (rhsLength-- > 0) {
            stack.pop();
            let stackEntry = stack.pop();

            if (hasSemanticAction) {
              semanticValueArgs.unshift(stackEntry.semanticValue);

              if (locationArgs) {
                locationArgs.unshift(stackEntry.loc);
              }
            }
          }
        }

        const reduceStackEntry = {symbol: production[0]};

        if (hasSemanticAction) {
          yytext = shiftedToken ? shiftedToken.value : null;
          yyleng = shiftedToken ? shiftedToken.value.length : null;

          const semanticActionArgs = (
            locationArgs !== null
              ? semanticValueArgs.concat(locationArgs)
              : semanticValueArgs
          );

          production[2](...semanticActionArgs);

          reduceStackEntry.semanticValue = __;

          if (locationArgs) {
            reduceStackEntry.loc = __loc;
          }
        }

        const nextState = stack[stack.length - 1];
        const symbolToReduceWith = production[0];

        stack.push(
          reduceStackEntry,
          table[nextState][symbolToReduceWith]
        );
      }

      // Accept.
      else if (entry === 'acc') {
        stack.pop();
        let parsed = stack.pop();

        if (stack.length !== 1 ||
            stack[0] !== 0 ||
            tokenizer.hasMoreTokens()) {
          // Restore options.
          yy.options = globalOptions;
          unexpectedToken(token);
        }

        if (parsed.hasOwnProperty('semanticValue')) {
          yy.options = globalOptions;
          yyparse.onParseEnd(parsed.semanticValue);
          return parsed.semanticValue;
        }

        yyparse.onParseEnd();

        // Restore options.
        yy.options = globalOptions;
        return true;
      }

    } while (tokenizer.hasMoreTokens() || stack.length > 1);
  },

  setTokenizer(customTokenizer) {
    tokenizer = customTokenizer;
    return yyparse;
  },

  getTokenizer() {
    return tokenizer;
  },

  onParseBegin(string, tokenizer, options) {},
  onParseEnd(parsed) {},

  /**
   * Allows analyzing, and transforming shifted token. Default implementation
   * just passes the token through.
   */
  onShift(token) {
    return token;
  },
};



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




function unexpectedToken(token) {
  if (token.type === EOF) {
    unexpectedEndOfInput();
  }

  tokenizer.throwUnexpectedToken(
    token.value,
    token.startLine,
    token.startColumn
  );
}

function unexpectedEndOfInput() {
  parseError(`Unexpected end of input.`);
}

function parseError(message) {
  throw new SyntaxError(message);
}

module.exports = yyparse;
