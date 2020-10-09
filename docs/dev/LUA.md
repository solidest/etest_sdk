# ETlua

ETlua 是开发测试程序的执行脚本时使用的编程语言，ETlua基于lua语言进行深度定制和扩展，主要扩展内容包括：
- 内置ETL编译器
- 内置ETL专用API
- 内置ETL专用全局对象
- 针对实时性进行优化的GC算法
- 异步编程功能
- 事件订阅/分发功能

## 数据类型
 
ETlua 是动态类型语言，变量不需要类型定义，可直接赋值。 值可以存储在变量中，作为参数传递或结果返回。ETlua 中有 8 个基本类型分别为：nil、boolean、number、string、userdata、function、thread 和 table。

数据类型|描述
-|-
nil	    |这个最简单，只有值nil属于该类，表示一个无效值（在条件表达式中相当于false）
boolean	|包含两个值：false和true
number	|表示双精度类型的实浮点数
string	|字符串由一对双引号或单引号来表示
function|由 C 或 ETlua 编写的函数
userdata|表示任意存储在变量中的C数据结构
thread	|表示执行的独立协程，用于执行协同程序
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

+ 流程控制语句通过程序设定一个或多个条件语句来设定。在条件为 true 时执行指定程序代码，在条件为 false 时执行其他指定代码

+ 控制结构的条件表达式结果可以是任何值，ETlua认为false和nil为假，true和非nil为真。

+ 要注意的是 0 为 true

    语句|	描述
    -|-
    if 语句	|if 语句 由一个布尔表达式作为条件判断，其后紧跟其他语句组成。
    if...else 语句	|if 语句 可以与 else 语句搭配使用, 在 if 条件表达式为 false 时执行 else 语句代码。
    if 嵌套语句	|你可以在if 或 else if中使用一个或多个 if 或 else if 语句 

## 函数

函数是对语句和表达式进行抽象的主要方法。既可以用来处理一些特殊的工作，也可以用来计算一些值。提供了许多的内建函数，你可以很方便的在程序中调用它们，如print()函数可以将传入的参数打印在控制台上。

函数主要有两种用途：

1.完成指定的任务，这种情况下函数作为调用语句使用

2.计算并返回值，这种情况下函数作为赋值语句的表达式使用

### 函数定义
+ ETlua 编程语言函数定义格式如下：

    ```lua
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

+ 函数可以返回多个结果值用逗号(,)隔开

### 可变参数
+ 函数可以接受可变数目的参数，和 C 语言类似，在函数参数列表中使用三点 ... 表示函数有可变的参数

    ```lua
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

    ```lua
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

    --以上代码执行结果为：
    --总共传入 6 个数
    --平均值为    5.5
    ```
+ 通过 select("#",...) 来获取可变参数的数量:

    ```lua
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
    --以上代码执行结果为：

    --总共传入 6 个数
    --平均值为    5.5

    ```

+ 可能需要几个固定参数加上可变参数，固定参数必须放在变长参数之前

    ```lua
    function fwrite(fmt, ...)  ---> 固定的参数fmt
        return io.write(string.format(fmt, ...))     
    end

    fwrite("runoob\n")       --->fmt = "runoob", 没有变长参数。  
    fwrite("%d%d\n", 1, 2)   --->fmt = "%d%d", 变长参数为 1 和 2
    
    -- 输出结果为：

    -- runoob
    -- 12

    ```

+ 通常在遍历变长参数的时候只需要使用 {…}，然而变长参数可能会包含一些 nil，那么就可以用 select 函数来访问变长参数了：select('#', …) 或者 select(n, …)

        select('#', …) 返回可变参数的长度
        select(n, …) 用于访问 n 到 select('#',…) 的参数

+ 调用select时，必须传入一个固定实参selector(选择开关)和一系列变长参数。如果selector为数字n,那么select返回它的第n个可变实参，否则只能为字符串"#",这样select会返回变长参数的总数

    ```lua
    do  
        function foo(...)  
            for i = 1, select('#', ...) do  -->获取参数总数
                local arg = select(i, ...); -->读取参数
                print("arg", arg);  
            end  
        end  

        foo(1, 2, 3, 4);  
    end
    --输出结果为：
    --arg    1
    --arg    2
    --arg    3
    --arg    4 

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

+ 下表列出了 ETlua 语言中的常用关系运算符，设定 A 的值为10，B 的值为 20：

    操作符|	描述|	实例
    -|-|-
    ==|	等于，检测两个值是否相等，相等返回 true，否则返回 false|	(A == B) 为 false。
    ~=|	不等于，检测两个值是否相等，相等返回 false，否则返回 true|	(A ~= B) 为 true。
    &gt;|大于，如果左边的值大于右边的值，返回 true，否则返回 false|	(A > B) 为 false。
    <|	小于，如果左边的值大于右边的值，返回 false，否则返回 true|	(A < B) 为 true。
    &gt;=|	大于等于，如果左边的值大于等于右边的值，返回 true，否则返回 false|	(A >= B) 返回 false。
    <=|	小于等于， 如果左边的值小于等于右边的值，返回 true，否则返回 false|	(A <= B) 返回 true。

### 逻辑运算符

+ 下表列出了 ETlua 语言中的常用逻辑运算符，设定 A 的值为 true，B 的值为 false：

    操作符|	描述|	实例
    -|-|-
    and |逻辑与操作符。 若 A 为 false，则返回 A，否则返回 B。	|(A and B) 为 false。
    or	|逻辑或操作符。 若 A 为 true，则返回 A，否则返回 B。	|(A or B) 为 true。
    not	|逻辑非操作符。与逻辑运算结果相反，如果条件为 true，逻辑非为 false。|	not(A and B) 为 true。

### 位操作符

+ 下表列出了 ETlua 语言中的常用位操作符

    操作符|	描述
    -|-
     &  |（按位与）操作法。
     &Iota; |（按位或）操作
     ~  | （按位异或）操作。 
     ~  |（按位非）操作。 
     << | （左移）操作。
    &gt;&gt; |（右移）操作。 

### 其他运算符

+ 下表列出了 ETlua 语言中的连接运算符与计算表或字符串长度的运算符：

    |操作符|	描述|	实例|
    |-|-|-
    |..	|连接两个字符串	|a..b ，其中 a 为 "Hello " ， b 为 "World", 输出结果为 "Hello World"。
    |#	|一元运算符，返回字符串或表的长度。|	#"Hello" 返回 5

### 运算符优先级

+ 从高到低的顺序：
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

## 数组

数组，就是相同数据类型的元素按一定顺序排列的集合，可以是一维数组和多维数组。

ETlua 数组的索引键值可以使用整数表示，数组的大小不是固定的

### 一维数组

+ 一维数组是最简单的数组，其逻辑结构是线性表。一维数组可以用for循环出数组中的元素

    ```lua
    array = {"ETlua", "Tutorial"}

    for i= 0, 2 do
        print(array[i])
    end
    
    --输出结果为 nil Lua Tutorial
    ```

+ 我们可以使用整数索引来访问数组元素，如果知道的索引没有值则返回nil。

+ 索引值是以 1 为起始，但你也可以指定 0 开始。

+ 除此外我们还可以以负数为数组索引值

### 多维数组

+ 多维数组即数组中包含数组或一维数组的索引键对应一个数组。

    ```lua
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

    --输出结果 1 2 3 2 4 6 3 6 9
    ```

## 迭代器

迭代器（iterator）是一种对象，它能够用来遍历标准模板库容器中的部分或全部元素，每个迭代器对象代表容器中的确定的地址。

迭代器是一种支持指针类型的结构，它可以遍历集合的每一个元素。

在ETlua中我们常常使用函数来描述迭代器，每次调用该函数就返回集合的下一个元素。ETlua 的迭代器包含以下两种类型：无状态的迭代器
和多状态的迭代器


### 泛型 for 迭代器

+ 泛型 for 在自己内部保存迭代函数，实际上它保存三个值：迭代函数、状态常量、控制变量。

+ 泛型 for 迭代器提供了集合的 key/value 对，语法格式如下：

    ```lua
    array = {"Google", "Runoob"}
    
    for key,value in ipairs(array) do
       print(key, value)
    end
    
    --输出结果为  1 Google  2 Runoob
    ```

+ 以上实例中我们使用了 ETlua 默认提供的迭代函数 ipairs。

+ 下面我们看看泛型 for 的执行过程：

    + 首先，初始化，计算 in 后面表达式的值，表达式应该返回泛型 for 需要的三个值：迭代函数、状态常量、控制变量；与多值赋值一样，如果表达式返回的结果个数不足三个会自动用 nil 补足，多出部分会被忽略。
    + 第二，将状态常量和控制变量作为参数调用迭代函数（注意：对于 for 结构来说，状态常量没有用处，仅仅在初始化时获取他的值并传递给迭代函数）。
    + 第三，将迭代函数返回的值赋给变量列表。
    + 第四，如果返回的第一个值为nil循环结束，否则执行循环体。
    + 第五，回到第二步再次调用迭代函数


### 无状态的迭代器

+ 无状态的迭代器是指不保留任何状态的迭代器，因此在循环中我们可以利用无状态迭代器避免创建闭包花费额外的代价。

+ 每一次迭代，迭代函数都是用两个变量（状态常量和控制变量）的值作为参数被调用，一个无状态的迭代器只利用这两个值可以获取下一个元素。

+ 这种无状态迭代器的典型的简单的例子是 ipairs，它遍历数组的每一个元素。

+ 以下实例我们使用了一个简单的函数来实现迭代器，实现 数字 n 的平方：

    ```lua
    function square(iteratorMaxCount,currentNumber)
        if currentNumber<iteratorMaxCount then
            currentNumber = currentNumber+1
            return currentNumber, currentNumber*currentNumber
        end
    end

    for i,n in square,3,0  do
        print(i,n)
    end

    -- 输出结果  1  1      2  4       3  9
    ```
+ 迭代的状态包括被遍历的表（循环过程中不会改变的状态常量）和当前的索引下标（控制变量），ipairs 和迭代函数都很简单，我们在 ETlua 中可以这样实现：

    ```lua
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

    ```lua
    array = {"Google", "Runoob"}

    function elementIterator (collection)
        local index = 0
        local count = #collection
        -- 闭包函数
        return function ()
            index = index + 1
            if index <= count then
                --  返回迭代器的当前元素
                return collection[index]
            end
        end
    end

    for element in elementIterator(array) do
        print(element)
    end

    --以上输出结果为：Google Runoob

    --以上我们可以看到，elementIterator 内使用了闭包函数，实现计算集合大小并输出各个元素
    ```
