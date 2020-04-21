## ETlua

ETlua 是开发测试程序的执行脚本时使用的编程语言，ETlua基于ETlua语言进行深度定制和扩展，主要扩展内容包括：
- 内置ETL编译器
- 内置ETL专用API
- 内置ETL专用全局对象
- 针对实时性进行优化的GC算法
- 异步编程功能
- 事件订阅/分发功能

## 数据类型
 
ETlua 是动态类型语言，变量不要类型定义,只需要为变量赋值。 值可以存储在变量中，作为参数传递或结果返回。ETlua 中有 8 个基本类型分别为：nil、boolean、number、string、userdata、function、thread 和 table。

数据类型|描述
-|-
nil	    |这个最简单，只有值nil属于该类，表示一个无效值（在条件表达式中相当于false）
boolean	|包含两个值：false和true
number	|表示双精度类型的实浮点数
string	|字符串由一对双引号或单引号来表示
function|	由 C 或 ETlua 编写的函数
userdata|	表示任意存储在变量中的C数据结构
thread	|表示执行的独立线路，用于执行协同程序
table	|表（table）其实是一个"关联数组"（associative arrays），数组的索引可以是数字、字符串或表类型。在 ETlua 里，table 的创建是通过"构造表达式"来完成，最简单构造表达式是{}，用来创建一个空表

### nil（空）

+ nil 类型表示一种没有任何有效值，它只有一个值 -- nil，例如打印一个没有赋值的变量，便会输出一个 nil 值
+ 对于全局变量和 table，nil 还有一个"删除"作用，给全局变量或者 table 表里的变量赋一个 nil 值，等同于把它们删掉
+ nil 作比较时应该加上双引号 "

### boolean（布尔）

+ boolean 类型只有两个可选值：true（真） 和 false（假），ETlua 把 false 和 nil 看作是 false，其他的都为 true，数字 0 也是 true

### number（数字）

+ 默认只有一种 number 类型 -- double（双精度）类型（默认类型可以修改 ETluaconf.h 里的定义）

### string（字符串）

+ 字符串由一对双引号或单引号来表示
+ 也可以用 2 个方括号 "[[]]" 来表示"一块"字符串
+ 在对一个数字字符串上进行算术操作时，会尝试将这个数字字符串转成一个数字
+ 使用 # 来计算字符串的长度，放在字符串前面

### table（表）

+ table 的创建是通过"构造表达式"来完成，最简单构造表达式是{}，用来创建一个空表。也可以在表里添加一些数据，直接初始化表
+ 的表（table）其实是一个"关联数组"（associative arrays），数组的索引可以是数字或者是字符串
+ 不同于其他语言的数组把 0 作为数组的初始索引，表的默认初始索引一般以 1 开始
+ table 不会固定长度大小，有新数据添加时 table 长度会自动增长，没初始的 table 都是 nil

### function（函数）

+ 函数是被看作是"第一类值（First-Class Value）"，函数可以存在变量里
+ function 可以以匿名函数（anonymous function）的方式通过参数传递

### thread（线程）

+ 最主要的线程是协同程序（coroutine）。它跟线程（thread）差不多，拥有自己独立的栈、局部变量和指令指针，可以跟其他协同程序共享全局变量和其他大部分东西
+ 线程跟协程的区别：线程可以同时多个运行，而协程任意时刻只能运行一个，并且处于运行状态的协程只有被挂起（suspend）时才会暂停

### userdata（自定义类型）

+ userdata 是一种用户自定义数据，用于表示一种由应用程序或 C/C++ 语言库所创建的类型，可以将任意 C/C++ 的任意数据类型的数据（通常是 struct 和 指针）存储到 ETlua 变量中调用

## 变量

变量在使用前，必须在代码中进行声明，即创建该变量。

编译程序执行代码之前编译器需要知道如何给语句变量开辟存储区，用于存储变量的值。

ETlua 变量有三种类型：全局变量、局部变量、表中的域。

ETlua 中的变量全是全局变量，那怕是语句块或是函数里，除非用 local 显式声明为局部变量。

局部变量的作用域为从声明位置开始到所在语句块结束。

变量的默认值均为 nil。

### 赋值语句

+ 赋值是改变一个变量的值和改变表域的最基本的方法。
+ 可以对多个变量同时赋值，变量列表和值列表的各个元素用逗号分开，赋值语句右边的值会依次赋给左边的变量
+ 遇到赋值语句会先计算右边所有的值然后再执行赋值操作
+ 当变量个数和值的个数不一致时,.变量个数 > 值的个数,按变量个数补足nil.变量个数 < 值的个数,多余的值会被忽略

### 索引

+ 对 table 的索引使用方括号 []

## 循环

很多情况下我们需要做一些有规律性的重复操作，因此在程序中就需要重复执行某些语句。

一组被重复执行的语句称之为循环体，能否继续重复，决定循环的终止条件。

循环结构是在一定条件下反复执行某段程序的流程结构，被反复执行的程序被称为循环体。

循环语句是由循环体及循环的终止条件两部分组成的


循环类型| 	描述
-|-
while 循环	|在条件为 true 时，让程序重复地执行某些语句。执行语句前会先检查条件是否为 true。
for 循环	|重复执行指定语句，重复次数可在 for 语句中控制。
repeat...until	|重复执行循环，直到 指定的条件为真时为止
循环嵌套	|可以在循环内嵌套一个或多个循环语句（while do ... end;for ... do ... end;repeat ... until;）

### 循环控制语句

+ 循环控制语句用于控制程序的流程， 以实现程序的各种结构方式
     - 控制语句|	描述
     -|-
    - break 语句|	退出当前循环或语句，并开始脚本执行紧接着的语句。
    - goto 语句|	将程序的控制点转移到一个标签处

### 无限循环

+ 在循环体中如果条件永远为 true 循环语句就会永远执行下

### 流程控制

流程控制语句通过程序设定一个或多个条件语句来设定。在条件为 true 时执行指定程序代码，在条件为 false 时执行其他指定代码

控制结构的条件表达式结果可以是任何值，ETlua认为false和nil为假，true和非nil为真。

要注意的是 0 为 true

语句|	描述
-|-
if 语句	|if 语句 由一个布尔表达式作为条件判断，其后紧跟其他语句组成。
if...else 语句	|if 语句 可以与 else 语句搭配使用, 在 if 条件表达式为 false 时执行 else 语句代码。
if 嵌套语句	|你可以在if 或 else if中使用一个或多个 if 或 else if 语句 。

## 函数

函数是对语句和表达式进行抽象的主要方法。既可以用来处理一些特殊的工作，也可以用来计算一些值。提供了许多的内建函数，你可以很方便的在程序中调用它们，如print()函数可以将传入的参数打印在控制台上。

函数主要有两种用途：

1.完成指定的任务，这种情况下函数作为调用语句使用；
2.计算并返回值，这种情况下函数作为赋值语句的表达式使用

### 函数定义
+ ETlua 编程语言函数定义格式如下：

    ```
    optional_function_scope function function_name( argument1, argument2, argument3..., argumentn)
        function_body
        return result_params_comma_separated
    end
    ```


- optional_function_scope: 该参数是可选的制定函数是全局函数还是局部函数，未设置该参数默认为全局函数，如果你需要设置函数为局部函数需要使用关键字 local。

- function_name: 指定函数名称。

- argument1, argument2, argument3..., argumentn: 函数参数，多个参数以逗号隔开，函数也可以不带参数。

- function_body: 函数体，函数中需要执行的代码语句块。

- result_params_comma_separated: 函数返回值，ETlua语言函数可以返回多个值，每个值以逗号隔开

### 多返回值

+ 函数可以返回多个结果值,用,隔开

### 可变参数
+ 函数可以接受可变数目的参数，和 C 语言类似，在函数参数列表中使用三点 ... 表示函数有可变的参数

    ```
    function add(...)  
        local s = 0  
        for i, v in ipairs{...} do   --> {...} 表示一个由所有变长参数构成的数组  
            s = s + v  
        end  
        return s  
    end  
    print(add(3,4,5,6,7))  --->25
    ```

+ 我们可以将可变参数赋值给一个变量。

    ```
    function average(...)
        result = 0
        local arg={...}    --> arg 为一个表，局部变量
        for i,v in ipairs(arg) do
            result = result + v
        end
        print("总共传入 " .. #arg .. " 个数")
        return result/#arg
    end

    print("平均值为",average(10,5,3,4,5,6))

    以上代码执行结果为：
    总共传入 6 个数
    平均值为    5.5
    ```
+ 通过 select("#",...) 来获取可变参数的数量:


    ```
    function average(...)
        result = 0
        local arg={...}
        for i,v in ipairs(arg) do
            result = result + v
        end
        print("总共传入 " .. select("#",...) .. " 个数")
        return result/select("#",...)
    end

    print("平均值为",average(10,5,3,4,5,6))
    以上代码执行结果为：

    总共传入 6 个数
    平均值为    5.5
    ```

+ 可能需要几个固定参数加上可变参数，固定参数必须放在变长参数之前

    ```
    function fwrite(fmt, ...)  ---> 固定的参数fmt
        return io.write(string.format(fmt, ...))     
    end

    fwrite("runoob\n")       --->fmt = "runoob", 没有变长参数。  
    fwrite("%d%d\n", 1, 2)   --->fmt = "%d%d", 变长参数为 1 和 2
    
    输出结果为：

    runoob
    12

    ```

+ 通常在遍历变长参数的时候只需要使用 {…}，然而变长参数可能会包含一些 nil，那么就可以用 select 函数来访问变长参数了：select('#', …) 或者 select(n, …)

        select('#', …) 返回可变参数的长度
        select(n, …) 用于访问 n 到 select('#',…) 的参数

+ 调用select时，必须传入一个固定实参selector(选择开关)和一系列变长参数。如果selector为数字n,那么select返回它的第n个可变实参，否则只能为字符串"#",这样select会返回变长参数的总数

    ```
    do  
        function foo(...)  
            for i = 1, select('#', ...) do  -->获取参数总数
                local arg = select(i, ...); -->读取参数
                print("arg", arg);  
            end  
        end  

        foo(1, 2, 3, 4);  
    end
    输出结果为：
    arg    1
    arg    2
    arg    3
    arg    4 

    ```    

##  运算符
运算符是一个特殊的符号，用于告诉解释器执行特定的数学或逻辑运算。ETlua提供了以下几种运算符类型：

算术运算符

关系运算符

逻辑运算符

其他运算符

### 算术运算符

+ 下表列出了 ETlua 语言中的常用算术运算符，设定 A 的值为10，B 的值为 20

    操作符|	描述|	实例
    -|-|-
    +|	加法|	A + B 输出结果 30
    -|	减法|	A - B 输出结果 -10
    *|	乘法|	A * B 输出结果 200
    /|	除法|	B / A w输出结果 2
    %|	取余|	B % A 输出结果 0
    ^|	乘幂|	A^2 输出结果 100
    -|	负号|	-A 输出结果 -10

### 关系运算符

下表列出了 ETlua 语言中的常用关系运算符，设定 A 的值为10，B 的值为 20：

操作符|	描述|	实例
-|-|-
==|	等于，检测两个值是否相等，相等返回 true，否则返回 false|	(A == B) 为 false。
~=|	不等于，检测两个值是否相等，相等返回 false，否则返回 true|	(A ~= B) 为 true。
>	|大于，如果左边的值大于右边的值，返回 true，否则返回 false|	(A > B) 为 false。
<|	小于，如果左边的值大于右边的值，返回 false，否则返回 true|	(A < B) 为 true。
>=|	大于等于，如果左边的值大于等于右边的值，返回 true，否则返回 false|	(A >= B) 返回 false。
<=|	小于等于， 如果左边的值小于等于右边的值，返回 true，否则返回 false|	(A <= B) 返回 true。

### 逻辑运算符

下表列出了 ETlua 语言中的常用逻辑运算符，设定 A 的值为 true，B 的值为 false：

操作符|	描述|	实例
-|-|-
and|	逻辑与操作符。 若 A 为 false，则返回 A，否则返回 B。	|(A and B) 为 false。
or	|逻辑或操作符。 若 A 为 true，则返回 A，否则返回 B。	|(A or B) 为 true。
not	|逻辑非操作符。与逻辑运算结果相反，如果条件为 true，逻辑非为 false。|	not(A and B) 为 true。

### 位操作符

|操作符|	描述|
|-|-|

- （& ）（按位与）操作法。

- （ | ）（按位或）操作
- （ ~ ）  （按位异或）操作。 
- （ ~ ） （按位非）操作。 
- （ << ）  （左移）操作。
- （ >> ） （右移）操作。 

### 其他运算符

下表列出了 ETlua 语言中的连接运算符与计算表或字符串长度的运算符：

|操作符|	描述|	实例|
|-|-|-
|..	|连接两个字符串	|a..b ，其中 a 为 "Hello " ， b 为 "World", 输出结果为 "Hello World"。
|#	|一元运算符，返回字符串或表的长度。|	#"Hello" 返回 5

### 运算符优先级

从高到低的顺序：
```
^
not    - (unary)
*      /
+      -
..
<      >      <=     >=     ~=     ==
and
or 
```

## 字符串

字符串或串(String)是由数字、字母、下划线组成的一串字符。

ETlua 语言中字符串可以使用以下三种方式来表示：

单引号间的一串字符。

双引号间的一串字符。

[[和]]间的一串字符。

义字符用于表示不能直接显示的字符，比如后退键，回车键，等。如在字符串转换双引号可以使用 "\""。

所有的转义字符和所对应的意义：

转义字符|意义|ASCII码值（十进制）
-|-|-
\a|响铃(BEL)|007
\b|退格(BS) ，将当前位置移到前一列|008
\f|换页(FF)，将当前位置移到下页开头|012
\n|换行(LF) ，将当前位置移到下一行开头|010
\r|回车(CR) ，将当前位置移到本行开头|013
\t|水平制表(HT) （跳到下一个TAB位置）|009
\v|垂直制表(VT)|011
\ \ |代表一个反斜线字符''\\'|092
\\'|代表一个单引号（撇号）字符|039
\\"|代表一个双引号字符|034
\0|空字符(NULL)|000
\ddd|1到3位八进制数所代表的任意字符|三位八进制
\xhh|1到2位十六进制所代表的任意字符|二位十六进制

### 字符串格式化
提供了 string.format() 函数来生成具有特定格式的字符串, 函数的第一个参数是格式 , 之后是对应格式中每个代号的各种数据。

由于格式字符串的存在, 使得产生的长字符串可读性大大提高了。这个函数的格式很像 C 语言中的 printf()。

以下实例演示了如何对字符串进行格式化操作：

格式字符串可能包含以下的转义码:

+ %c - 接受一个数字, 并将其转化为ASCII码表中对应的字符
+ %d, %i - 接受一个数字并将其转化为有符号的整数格式
+ %o - 接受一个数字并将其转化为八进制数格式
+ %u - 接受一个数字并将其转化为无符号整数格式
+ %x - 接受一个数字并将其转化为十六进制数格式, 使用小写字母
+ %X - 接受一个数字并将其转化为十六进制数格式, 使用大写字母
+ %e - 接受一个数字并将其转化为科学记数法格式, 使用小写字母e
+ %E - 接受一个数字并将其转化为科学记数法格式, 使用大写字母E
+ %f - 接受一个数字并将其转化为浮点数格式
+ %g(%G) - 接受一个数字并将其转化为%e(%E, 对应%G)及%f中较短的一种格式
+ %q - 接受一个字符串并将其转化为可安全被ETlua编译器读入的格式
+ %s - 接受一个字符串并按照给定的参数格式化该字符串
+ 为进一步细化格式, 可以在%号后添加参数. 参数将以如下的顺序读入:

    - (1) 符号: 一个+号表示其后的数字转义符将让正数显示正号. 默认情况下只有负数显示符号.
    - (2) 占位符: 一个0, 在后面指定了字串宽度时占位用. 不填时的默认占位符是空格.
    - (3) 对齐标识: 在指定了字串宽度时, 默认为右对齐, 增加-号可以改为左对齐.
    - (4) 宽度数值
    - (5) 小数位数/字串裁切: 在宽度数值后增加的小数部分n, 若后接f(浮点数转义符, 如%6.3f)则设定该浮点数的小数只保留n位, 若后接s(字符串转义符, 如%5.3s)则设定该字符串只显示前n位.

### 字符与整数相互转换

以下实例演示了字符与整数相互转换：

```
    -- 字符转换
    -- 转换第一个字符
    print(string.byte("ETlua"))
    -- 转换第三个字符
    print(string.byte("ETlua",3))
    -- 转换末尾第一个字符
    print(string.byte("ETlua",-1))
    -- 第二个字符
    print(string.byte("ETlua",2))
    -- 转换末尾第二个字符
    print(string.byte("ETlua",-2))

    -- 整数 ASCII 码转换为字符
    print(string.char(97))
    以上代码执行结果为：

    76
    97
    97
    117
    117
    a
```

### 匹配模式

ETlua 中的匹配模式直接用常规的字符串来描述。 它用于模式匹配函数 string.find, string.gmatch, string.gsub, string.match。

你还可以在模式串中使用字符类。

字符类指可以匹配一个特定字符集合内任何字符的模式项。比如，字符类 %d 匹配任意数字

下面的表列出了ETlua支持的所有字符类：

单个字符(除 ^$()%.[]*+-? 外): 与该字符自身配对
+ .(点): 与任何字符配对
+ %a: 与任何字母配对
+ %c: 与任何控制符配对(例如\n)
+ %d: 与任何数字配对
+ %l: 与任何小写字母配对
+ %p: 与任何标点(punctuation)配对
+ %s: 与空白字符配对
+ %u: 与任何大写字母配对
+ %w: 与任何字母/数字配对
+ %x: 与任何十六进制数配对
+ %z: 与任何代表0的字符配对
+ %x(此处x是非字母非数字字符): 与字符x配对. 主要用来处理表达式中有功能的字符(^$()%.[]*+-?)的配对问题, 例如%%与%配对
+ [数个字符类]: 与任何[]中包含的字符类配对. 例如[%w_]与任何字母/数字, 或下划线符号(_)配对
+ [^数个字符类]: 与任何不包含在[]中的字符类配对. 例如[^%s]与任何非空白字符配对

当上述的字符类用大写书写时, 表示与非此字符类的任何字符配对.


#### 在模式匹配中有一些特殊字符，他们有特殊的意义，特殊字符如下：
```
( ) . % + - * ? [ ^ $

'%' 用作特殊字符的转义字符，因此 '%.' 匹配点；'%%' 匹配字符 '%'。转义字符 '%'不仅可以用来转义特殊字符，还可以用于所有的非字母的字符。
```

#### 模式条目可以是：

+ 单个字符类匹配该类别中任意单个字符；
+ 单个字符类跟一个 '*'， 将匹配零或多个该类的字符。 这个条目总是匹配尽可能长的串；
+ 单个字符类跟一个 '+'， 将匹配一或更多个该类的字符。 这个条目总是匹配尽可能长的串；
+ 单个字符类跟一个 '-'， 将匹配零或更多个该类的字符。 和 '*' 不同， 这个条目总是匹配尽可能短的串；
+ 单个字符类跟一个 '?'， 将匹配零或一个该类的字符。 只要有可能，它会匹配一个；
+ %n， 这里的 n 可以从 1 到 9； 这个条目匹配一个等于 n 号捕获物（后面有描述）的子串。
+ %bxy， 这里的 x 和 y 是两个明确的字符； 这个条目匹配以 x 开始 y 结束， 且其中 x 和 y 保持 平衡 的字符串。 意思是，如果从左到右读这个字符串，对每次读到一个 x 就 +1 ，读到一个 y 就 -1， 最终结束处的那个 y 是第一个记数到 0 的 y。 举个例子，条目 %b() 可以匹配到括号平衡的表达式。
+ %f[set]， 指 边境模式； 这个条目会匹配到一个位于 set 内某个字符之前的一个空串， 且这个位置的前一个字符不属于 set 。 集合 set 的含义如前面所述。 匹配出的那个空串之开始和结束点的计算就看成该处有个字符 '\0' 一样。

#### 模式：

+ 模式 指一个模式条目的序列。 在模式最前面加上符号 '^' 将锚定从字符串的开始处做匹配。 在模式最后面加上符号 '$' 将使匹配过程锚定到字符串的结尾。 如果 '^' 和 '$' 出现在其它位置，它们均没有特殊含义，只表示自身。

#### 捕获：

+ 模式可以在内部用小括号括起一个子模式； 这些子模式被称为 捕获物。 当匹配成功时，由 捕获物 匹配到的字符串中的子串被保存起来用于未来的用途。 捕获物以它们左括号的次序来编号。 例如，对于模式 "(a*(.)%w(%s*))" ， 字符串中匹配到 "a*(.)%w(%s*)" 的部分保存在第一个捕获物中 （因此是编号 1 ）； 由 "." 匹配到的字符是 2 号捕获物， 匹配到 "%s*" 的那部分是 3 号。

+ 作为一个特例，空的捕获 () 将捕获到当前字符串的位置（它是一个数字）。 例如，如果将模式 "()aa()" 作用到字符串 "flaaap" 上，将产生两个捕获物： 3 和 5 。

## 数组

数组，就是相同数据类型的元素按一定顺序排列的集合，可以是一维数组和多维数组。

ETlua 数组的索引键值可以使用整数表示，数组的大小不是固定的

### 一维数组

+ 一维数组是最简单的数组，其逻辑结构是线性表。一维数组可以用for循环出数组中的元素

    ```
    array = {"ETlua", "Tutorial"}

    for i= 0, 2 do
    print(array[i])
    end
    ```
+ 我们可以使用整数索引来访问数组元素，如果知道的索引没有值则返回nil。

+ 索引值是以 1 为起始，但你也可以指定 0 开始。

+ 除此外我们还可以以负数为数组索引值

### 多维数组

+ 多维数组即数组中包含数组或一维数组的索引键对应一个数组。

    ```
    -- 初始化数组
    array = {}
    for i=1,3 do
    array[i] = {}
        for j=1,3 do
            array[i][j] = i*j
        end
    end

    -- 访问数组
    for i=1,3 do
    for j=1,3 do
        print(array[i][j])
    end
    end
    ```

## 迭代器

迭代器（iterator）是一种对象，它能够用来遍历标准模板库容器中的部分或全部元素，每个迭代器对象代表容器中的确定的地址。

迭代器是一种支持指针类型的结构，它可以遍历集合的每一个元素。


### 泛型 for 迭代器

泛型 for 在自己内部保存迭代函数，实际上它保存三个值：迭代函数、状态常量、控制变量。

泛型 for 迭代器提供了集合的 key/value 对，语法格式如下：

```
array = {"Google", "Runoob"}

for key,value in ipairs(array) 
do
   print(key, value)
end
```

以上实例中我们使用了 ETlua 默认提供的迭代函数 ipairs。

下面我们看看泛型 for 的执行过程：

+ 首先，初始化，计算 in 后面表达式的值，表达式应该返回泛型 for 需要的三个值：迭代函数、状态常量、控制变量；与多值赋值一样，如果表达式返回的结果个数不足三个会自动用 nil 补足，多出部分会被忽略。
+ 第二，将状态常量和控制变量作为参数调用迭代函数（注意：对于 for 结构来说，状态常量没有用处，仅仅在初始化时获取他的值并传递给迭代函数）。
+ 第三，将迭代函数返回的值赋给变量列表。
+ 第四，如果返回的第一个值为nil循环结束，否则执行循环体。
+ 第五，回到第二步再次调用迭代函数

在ETlua中我们常常使用函数来描述迭代器，每次调用该函数就返回集合的下一个元素。ETlua 的迭代器包含以下两种类型：

+ 无状态的迭代器
+ 多状态的迭代器

### 无状态的迭代器
+ 无状态的迭代器是指不保留任何状态的迭代器，因此在循环中我们可以利用无状态迭代器避免创建闭包花费额外的代价。

+ 每一次迭代，迭代函数都是用两个变量（状态常量和控制变量）的值作为参数被调用，一个无状态的迭代器只利用这两个值可以获取下一个元素。

+ 这种无状态迭代器的典型的简单的例子是 ipairs，它遍历数组的每一个元素。

+ 以下实例我们使用了一个简单的函数来实现迭代器，实现 数字 n 的平方：

    ```
    function square(iteratorMaxCount,currentNumber)
        if currentNumber<iteratorMaxCount then
            currentNumber = currentNumber+1
            return currentNumber, currentNumber*currentNumber
        end
    end
   
    for i,n in square,3,0
    do
        print(i,n)
    end


    输出: 1  1      2  4        3  9
     ```
+ 迭代的状态包括被遍历的表（循环过程中不会改变的状态常量）和当前的索引下标（控制变量），ipairs 和迭代函数都很简单，我们在 ETlua 中可以这样实现：

    ```
    function iter (a, i)
        i = i + 1
        local v = a[i]
        if v then
        return i, v
        end
    end
    
    function ipairs (a)
        return iter, a, 0
    end
    ```
+ 当 ETlua 调用 ipairs(a) 开始循环时，他获取三个值：迭代函数 iter、状态常量 a、控制变量初始值 0；然后 ETlua 调用 iter(a,0) 返回 1, a[1]（除非 a[1]=nil）；第二次迭代调用 iter(a,1) 返回 2, a[2]……直到第一个 nil 元素

### 多状态的迭代器
+ 很多情况下，迭代器需要保存多个状态信息而不是简单的状态常量和控制变量，最简单的方法是使用闭包，还有一种方法就是将所有的状态信息封装到 table 内，将 table 作为迭代器的状态常量，因为这种情况下可以将所有的信息存放在 table 内，所以迭代函数通常不需要第二个参数。

+ 以下实例我们创建了自己的迭代器：

    ```
    array = {"Google", "Runoob"}

    function elementIterator (collection)
    local index = 0
    local count = #collection
    -- 闭包函数
    return function ()
        index = index + 1
        if index <= count
        then
            --  返回迭代器的当前元素
            return collection[index]
        end
    end
    end

    for element in elementIterator(array)
    do
    print(element)
    end

    以上输出结果为：

    Google
    Runoob

    以上我们可以看到，elementIterator 内使用了闭包函数，实现计算集合大小并输出各个元素
    ```

## table(表)

table 是 一种数据结构用来帮助我们创建不同的数据类型，如：数组、字典等。

table 使用关联型数组，你可以用任意类型的值来作数组的索引，但这个值不能是 nil。

table 是不固定大小的，你可以根据自己需要进行扩容。

通过table来解决模块（module）、包（package）和对象（Object）的。 例如string.format表示使用"format"来索引table string。

### table(表)的构造

+ 构造器是创建和初始化表的表达式。表是ETlua特有的功能强大的东西。最简单的构造函数是{}，用来创建一个空表。可以直接初始化数组:
        ```
        -- 初始化表
        mytable = {}

        -- 指定值
        mytable[1]= "ETlua"

        -- 移除引用
        mytable = nil
        -- ETlua 垃圾回收会释放内存
        ```
+ 当我们为 table a 并设置元素，然后将 a 赋值给 b，则 a 与 b 都指向同一个内存。如果 a 设置为 nil ，则 b 同样能访问 table 的元素。如果没有指定的变量指向a，ETlua的垃圾回收机制会清理相对应的内存。
    ```
    以下实例演示了以上的描述情况：

    实例
    -- 简单的 table
    mytable = {}
    print("mytable 的类型是 ",type(mytable))

    mytable[1]= "ETlua"
    mytable["wow"] = "修改前"
    print("mytable 索引为 1 的元素是 ", mytable[1])
    print("mytable 索引为 wow 的元素是 ", mytable["wow"])

    -- alternatetable和mytable的是指同一个 table
    alternatetable = mytable

    print("alternatetable 索引为 1 的元素是 ", alternatetable[1])
    print("mytable 索引为 wow 的元素是 ", alternatetable["wow"])

    alternatetable["wow"] = "修改后"

    print("mytable 索引为 wow 的元素是 ", mytable["wow"])

    -- 释放变量
    alternatetable = nil
    print("alternatetable 是 ", alternatetable)

    -- mytable 仍然可以访问
    print("mytable 索引为 wow 的元素是 ", mytable["wow"])

    mytable = nil
    print("mytable 是 ", mytable)
    以上代码执行结果为：

    mytable 的类型是     table
    mytable 索引为 1 的元素是     ETlua
    mytable 索引为 wow 的元素是     修改前
    alternatetable 索引为 1 的元素是     ETlua
    mytable 索引为 wow 的元素是     修改前
    mytable 索引为 wow 的元素是     修改后
    alternatetable 是     nil
    mytable 索引为 wow 的元素是     修改后
    mytable 是     niltable(表)的构造
    ```


### Table 连接

+ 我们可以使用 concat() 输出一个列表中元素连接成的字符串:

    ```
    fruits = {"banana","orange","apple"}
    -- 返回 table 连接后的字符串
    print("连接后的字符串 ",table.concat(fruits))

    -- 指定连接字符
    print("连接后的字符串 ",table.concat(fruits,", "))

    -- 指定索引来连接 table
    print("连接后的字符串 ",table.concat(fruits,", ", 2,3))
    执行以上代码输出结果为：

    连接后的字符串     bananaorangeapple
    连接后的字符串     banana, orange, apple
    连接后的字符串     orange, apple
    ```

### 插入和移除

+ 以下实例演示了 table 的插入和移除操作:

```
    fruits = {"banana","orange","apple"}

    -- 在末尾插入
    table.insert(fruits,"mango")
    print("索引为 4 的元素为 ",fruits[4])

    -- 在索引为 2 的键处插入
    table.insert(fruits,2,"grapes")
    print("索引为 2 的元素为 ",fruits[2])

    print("最后一个元素为 ",fruits[5])
    table.remove(fruits)
    print("移除后最后一个元素为 ",fruits[5])
    执行以上代码输出结果为：

    索引为 4 的元素为     mango
    索引为 2 的元素为     grapes
    最后一个元素为     mango
    移除后最后一个元素为     nil
```

### Table 排序

+ 以下实例演示了 sort() 方法的使用，用于对 Table 进行排序：

    ```
    fruits = {"banana","orange","apple","grapes"}
    print("排序前")
    for k,v in ipairs(fruits) do
            print(k,v)
    end

    table.sort(fruits)
    print("排序后")
    for k,v in ipairs(fruits) do
            print(k,v)
    end
    执行以上代码输出结果为：

    排序前
    1    banana
    2    orange
    3    apple
    4    grapes
    排序后
    1    apple
    2    banana
    3    grapes
    4    orange
    ```

### Table 最大值

+ 我们定义了 table_maxn 方法来实现。

    ```
    以下实例演示了如何获取 table 中的最大值：

    实例
    function table_maxn(t)
    local mn=nil;
    for k, v in pairs(t) do
        if(mn==nil) then
        mn=v
        end
        if mn < v then
        mn = v
        end
    end
    return mn
    end
    tbl = {[1] = 2, [2] = 6, [3] = 34, [26] =5}
    print("tbl 最大值：", table_maxn(tbl))
    print("tbl 长度 ", #tbl)
    执行以上代码输出结果为：

    tbl 最大值：    34
    tbl 长度     3
    注意：

    当我们获取 table 的长度的时候无论是使用 # 还是 table.getn 其都会在索引中断的地方停止计数，而导致无法正确取得 table 的长度。

    可以使用以下方法来代替：

    function table_leng(t)
    local leng=0
    for k, v in pairs(t) do
        leng=leng+1
    end
    return leng;
    end
    ```