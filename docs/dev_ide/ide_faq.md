# 常见问题

### 协议检测无法使用
+ 协议本身协议段的编写错误
+ 在项目设置的基本设置中,没有配置好IP地址与端口号进行连接

### ETLua脚本无法执行
+ 检查脚本自身的内容以及输入参数
+ 是否配置,连接拓扑与监控面板
+ 连接拓扑中的运行时的接口绑定是否配置成功

### 执行脚本时监控面板无法正确显示
+ 检查监控面板中,记录的key值与命令的key值,通常发送为命令key值,接收为记录的key值
+ 检查数据接收或者发送时协议段的名称是否与监控面板中的所要对应的key值相同