# 简介

+ 关键字 device 用于描述装备与ETest之间通信报文使用的格式模版
+ 关键字 topology  用于秒速拓扑结构
+ 自定义的协议名称在同一项目内必须唯一


# 设备组成

## 拓扑结构


+ ``` lingking```  接口之间的连接，由各种连接方式组成，可以为总线，点到点连接等

+ ``` mapping``` 设备映射，包含两个参数，参数名固定分别为uut表示被测硬件单元（即硬件）、etest表示软设备（即与硬件上接口通信的软件）

+ ``` binding``` 接口绑定，当接口为软件所提供时，绑定接口地址设置为auto，表示自动获取网络地址

    > 举例：包含各类型的拓扑结构
   
           
                topology topo_2 {

                        //接口之间的连接
                        linking: {
                            bus_1: [dev_1.s1, dev2.s1, dev_2.s1, dev_3.clt_1],   //总线
                            link_1: [dev_3.srv_2, dev_2.srv_2], //点到点连接
                            _: [dev_2.clt_1, dev_1.clt_1],
                            _: [dev_3.s1, dev_3.s2, dev_2.s3], //总线
                            link_3: [],
                            link_4: [dev_1.ad1, dev_3.da1],
                        }

                        //设备映射
                        mapping: {
                            uut: [dev_2, dev_1],   //被测硬件单元
                            etest: [dev2, dev_3], //软设备
                        }

                        //接口绑定
                        binding: {
                            dev2.s1: 'auto',
                            dev_3.s1: 'com2@192.168.1.5',
                            dev_3.clt_1: 'can_a:1@192.168.1.5',
                        }
                }
            

## 设备接口

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

                    udp clt_1 { ip: '127.0.0.1', prot: 8888 }
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

