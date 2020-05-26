# 简介

+ 关键字 device 用于描述装备与ETest之间通信报文使用的格式模版
+ 关键字 topology  用于秒速拓扑结构
+ 自定义的协议名称在同一项目内必须唯一

# 设备设备接口

+ ```udp``` 通信协议，参数ip地址（ip）、端口号（prot）、数据包分发次数（ttl）

+ ```tcp_client```  TCP通信协议客户端，参数ip地址

+ ```tcp_server```  TCP通信协议服务端，参数ip地址，端口号

+ ```serial_ttl``` 串口 参数 baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控

+ ```serial_232``` 串口 参数 baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控

+ ```serial_422``` 串口 参数 baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控

+ ```serial_485``` 串口 参数 baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控

+ ```di``` 开关量输入反映开关量的状态是分还是合 ， 参数 minv：最小电压；maxv：最大电压

+ ```do```开关量输出可以是继电器或大功率管等  ，参数 minv：最小电压；maxv：最大电压

+ ```da```将数字信号转换为模拟信号 ，参数 ratio:分辨； minv：最小电压；maxv：最大电压，当最大电压与最小电压一致时，分辨率越大表示精度越高

+ ```ad```将模拟信号转换成数字信号 ， 参数 ratio:分辨； minv：最小电压；maxv：最大电压，当最大电压与最小电压一致时，分辨率越大表示精度越高

    > 举例：包含各类型的设备

                device dev_0 {
                    udp srv_1 { ip: '127.0.0.1', port: 3000, ttl: 20 }
                    tcp_client clt_2 { ip: '127.0.0.1' }
                    tcp_server srv_2 { ip: '127.0.0.1', port: 3000 }

                    udp clt_1 { ip: '127.0.0.1', port: 8888 }
                    udp udp_name {ip: '0.0.0.0', port: 8888}

                    //baudrate: 波特率；databits: 数据位； stopbits: 停止位； xonxoff: 软件流控；rtscts：硬件流控
                    serial_ttl s1 { baudrate: 9600, databits: 6, stopbits: 1.5, xonxoff: true, rtscts: true }
                    serial_232 s2 { baudrate: 9600 }
                    serial_422 s3 { baudrate: 9600 }
                    serial_485 s4 { baudrate: 9600 }
                
                    di di1 { minv: 3, maxv: 5 }
                    do do1 { minv: 3, maxv: 5 }

                    //ratio 分辨率；
                    da da1 { ratio: 8, minv: 0, maxv: 24 }
                    ad ad1 { ratio: 16, minv: 0, maxv: 12 }
                }

