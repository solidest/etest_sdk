
# DevTools

DevTools包含多个实用工具，供定制开发时使用，包括

- `etl-cli` etl命令行执行工具
- `etl-vsix` etl专用vscode插件
- `etl-ui-viewer` 开发模式下的实时ui查看器

## etl-cli

#### etl参数选项

#### etl -i 

- 指定执行某个文件
- 举例： `etl run/stop -i 文件名称 run_id`

#### etl -r

- 在实时模式下执行

#### etl setup

- 在etestx中设置环境

#### etl state

- 查看当前ETest执行器的状态
- 返回`idle`表示空闲状态，可以启动任务进行执行 
- 返回为`uuid`表示该执行器被占用

#### etl run

- 启动执行项目内的一个测试程序
- 用法`etl run run_id`

#### etl stop

- 强制停止测试程序的执行

#### etl -i 

- 指定执行某个文件
- 举例： `etl run/stop -i 文件名称 run_id`

#### etl -r


## etl-vsix

在vscode的插件市场搜索etl进行安装

## etl-ui-viewer

跨平台单一执行程序，自带图形界面
