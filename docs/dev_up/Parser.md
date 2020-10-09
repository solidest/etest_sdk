
# Parser模块说明
- Parser模块用于对ETL代码和各类表达式语法进行解析

## parseEtl
- 使用方法：let ast = parser.parseEtl(code)
- 输入etl代码，返回解析后的抽象语法树
- 解析出错时抛出异常

## parseSegtype
- 使用方法：let ast = parser.parseSegtype(code)
- 输入协议段解析字符串（不含引号），返回解析后的抽象语法树
- 解析出错时抛出异常

## parseExp
- 使用方法：let ast = parser.parseExp(code)
- 输入表达式字符串（不含引号），返回解析后的抽象语法树
- 可解析技术表达式或对象字面量表达式
- 解析出错时抛出异常