
# DevTools

DevTools包含多个实用工具，供定制开发时使用，包括

- `etl-cli` etl命令行执行工具
- `etl-vsix` etl专用vscode插件
- `etl-vue` 使用前端框架vue开发的etl ui组件库

## etl-cli

#### etl命令

##### etl setup

- 将项目执行环境安装到ETest执行器中

##### etl state

- 查看当前ETest执行器的状态
- 返回`idle`表示空闲状态，可以启动任务进行执行 
- 返回为`uuid`表示该执行器被占用

##### etl run

- 启动执行项目内的一个测试程序
- 用法`etl run run_id`

##### etl stop

- 强制停止测试程序的执行

#### etl命令参数选项

##### -i 

- 指定测试项目的index索引配置文件
- 缺省情况下，使用项目根目录中的index.yml做为项目索引配置文件
- 举例： `etl -i index1.yml run run_id`

##### -r

- 在实时模式下执行
- 举例：`etl -r run run_id`


## etl-vsix

etl专用vscode插件

#### 安装使用

- 在vscode的插件市场搜索etl进行安装
![vscode etl插件](https://solidest.github.io/etest_sdk/VSCODE.png)

## etl-vue

使用前端框架vue开发的etl ui专用组件库，源代码开放
![ETL-VUE-监控组件](https://solidest.github.io/etest_sdk/VUE1.png)
![ETL-VUE-数据分析组件](https://solidest.github.io/etest_sdk/VUE2.png)

#### 安装使用

- 使用git克隆代码库 https://github.com/solidest/etest_vue.git

- 执行 `yarn install` 进行安装

- 执行 `yarn electron:serve` 启动可视化开发
