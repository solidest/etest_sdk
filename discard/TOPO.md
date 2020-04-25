## 简介
连接拓扑描述测试环境中设备接口之间的连接关系


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