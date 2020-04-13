
# ETestDev更新说明

## SDK 
### 0.1.1
- 更新run.js文件
- 配合`log`API 在控制台输出带颜色背景信息

## ETestD
### 0.1.3
- 将API `entry` 合并入 `output`


## ETestX
### 0.1.6
- `string`类型协议段支持设置成数组
- API基础库中去掉了 `warn`
- API中增加可`log`库，包含有：

    - `log.info`
    - `log.warn`
    - `log.error`
    - `log.step`
    - `log.action`

### 0.1.7
- string结尾符解析方式下，最大长度限制为3000字节，防止极端情况解析器内存溢出
- 优化解析器插件输入参数