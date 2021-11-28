

# 项目介绍

上线地址：

前端 github 地址：https://github.com/LINGyue-dot/Vze-Chat-Frontend

后端 github 地址



一个即时通讯的项目，目前已经实现

* 一对一文字图片聊天
* 群聊文字图片聊天
* 消息的可靠有序传输
* 离线消息推送
* 心跳检测
* 断线重连
* 图片的切片上传以及秒传
* 一对一视频聊天（由于 https 限制未加入到聊天室中，路由位于 `/offer` `/answer` ）

> 如只在意 IM 实现技术直接转下方的 IM 开发章节

## 配置依赖

### 前端

Vue3 全家桶 + TS + Antdv 

核心技术使用 websocket 进行通信，同时在一对一视频聊天使用的是 socket.io （由于还没完全加入到聊天室中，所以暂时隔离）

项目使用大量的 vuex 用于存储消息，用户的信息等（这部分可以考虑使用 localStorage 来进行本地存储）

### 后端

Koa + TS + mysql + redis + websocket

由于 mysql 的配置 TS 支持不好（不知是不是编辑器问题） 所以后端 models 层是用 JS 来写

> 注意在整个项目中可以使用 mysql 完成 redis 的全部能力











# Websocket



### 心跳包发送

**为什么需要发心跳包**？

* 长连接保持连接防止 **NAT** 超时（因为 TCP 本身只要设置 Keep-Alive 就不会自动断开）
* 为了实时知道客户端服务端的状态即探测连接是否断开

**具体实现**

前端当没有向 websocket 发送数据后每 5s 发送一个心跳包，用 flag 标识后端未返回次数，当前端发送第二个心跳包时候 flag 大于等于2时或者发送心跳包失败就视为连接断开，后端启动一个 7s 的摧毁倒计时





### 断线重连

客户端发送心跳包给服务端，服务端每接收到心跳包之后重新开始摧毁该连接的倒计时

**如何判断是否断线：**

客户端：发送两个心跳包后当要发送第三个心跳包时候发现还没收到（此时服务端出现问题）或者客户端无法发送心跳包（客户端网络出现问题）那么就断线

服务端：由于长时间没有接收到心跳包所有就摧毁该连接（客户端或者服务端问题）

极端情况：如果客户端断线的一瞬间正好断网导致心跳包无法发送，客户端会尝试使用这个旧的连接如果可用的话就直接使用，如果不可用就尝试去创建一个新的连接。（服务端为主体即客户端需要断开连接时候需要等待服务端，等待服务端的连接不可用时候才可以重新连接）



# WebRTC

## 介绍

连接的三个问题

假设 peerA peerB 想互相通信

1. 如何发现对方，如何知道对方的 ip 地址

   使用信令(Signaling)服务器，即 perrA peerB 都与信令服务器直连。由服务器进行两者的数据处理交换

2. 由于不同浏览器对音视频的编码能力支持不一致，那么两者的视频编码能力如何保证一致

    `WebRTC 中的 ` SDP ` 协议可以表示编码能力的信息，所以需要交换 `SDP` 信息，在交换的过程也称之为媒体协商

3. 音视频数据如何传输，即如何了解对方的网络地址

   如果每个浏览器每台电脑都有自己的私有公网 ip 地址，那么可以直接点对点进行连接。但由于安全以及 IPV4 的地址不够考虑，需要用 NAT 。WebRTC 中使用 ICE 机制建立网络

ICE：交互式连接建立

不是协议，是整合 STUN 和 TURN 协议的框架， STUN 允许 NAT 后客户端找到自己对应的公网 IP 地址和端口（也就是打洞）如果是对称型的路由器的话就无法打洞成功（因为会抛弃，具体看下文），那么就需要 TURN 来解决，即通过 TURN 服务器请求公网 IP 地址作为中继地址

ICE 候选人：（优先级从上到下）

1. 主机候选人：表示本地局域网的 ip 地址，端口。也就是说 WebRTC 底层，会首先尝试本地局域网内建立连接
2. 反射候选人：表示 NAT 内主机的外网 ip 地址，端口。接着尝试反射获取的 IP 地址以及端口连接
3. 中继候选人：表示中继服务器。接着尝试中转服务器来建立连接



通信图



## 媒体协商

如下图：就是  Amy 发送 offer Bob 返回 Answer

<img src="http://120.27.242.14:9900/uploads/upload_21df5c5daf80118353f56251c2c19241.png" alt="image-20211101180601769" style="zoom:67%;" />









## 几个问题

### 对称型路由器为什么无法直接进行 P2P？

采用 NAT 的话，client 发送请求时候 TCP 和 UDP 都会自动在本地绑定一个端口，这个绑定的映射表是由路由器来管理的。

如果 client (192.168.0.2:8000) NAT 路由器分配了公网地址 (8,8,8,8:10)，那么进行了这次通讯，对称型路由器会存这两地址的映射

那么此时 server (1,1,1,1:1000) 想 client 发送，则路由器会将数据转发

当之后又有 server (2,2,2,2:2000) 向 client 发送数据，则对称性路由器会将其丢弃拒绝转发（因为映射表已经存在）



## 连接流程

* 本质上是客户端与客户端之间连接
* 直播：本质上只是客户端与主播机子连接，利用主播的机子来进行推流，服务端同样来获取主播直播的数据，然后获取到本地

### 1. 获取设备的摄像头/音频数据流

```js
navigator.mediaDevices
		.getUserMedia({ audio: false, video: true })
		.then(stream => {
			// stream 即数据流
    		// videoARef 即 <video ref="videoARef"></video>
			videoARef.value.srcObject = stream; // 挂载到 video tag 的 srcObj 属性上
			videoARef.value.onloadedmetadata = () => { // 装载成功就立即播放
					videoARef.value?.play(); 
			};
		});
```

### 2. 建立端之间的通信

主要涉及到利用 ICE 进行通信实现 NAT 穿越

* 借助信令服务器来进行媒体协商
* 利用 ICE 中的 STUN TURN 来实现 NAT 穿越

假设 offer 发送他的数据流给 answer 显示

1.  offer 获取本地设备数据流并创建 `RTCPeerConnection` 
2. offer 将数据流通过 peer 连接传输
3. offer 通过 socket 发送其候选人信息
4. offer 通过 socket 发送 peer 连接生成的 `offer` 信息
5. answer 接收 offer 的 offer 之后通过 `setRemoteDescription` 设置 peer 的 `remoteDescription` 属性即 远程的 sdp 信息
6. answer 调用 `createAnswer` 设置为 `localDEscription` 即自身的 sdp 并发送 `answer` 给服务器
7. offer 接收到 `answer` 之后设置对方的 `sdp` 信息
8.  webrtc 连接已经建立，但是双方还不能通信，因为 ICE 还没处理，通信双方还没确定最优的连接方式
9. answer 接收到 ICE 数据时候，调用 `RTCPeerConnection` 的 `addIceCandidate`
10. offer 收到 answer 的 ICE 数据时候，同上调用方法进行连接



本质上就是 sdp 信息交换（包括 nat 之后的 ip 信息）和 ice 候选人信息交换（选择通信的线路）



![6cb372db929540878425bc8026e102b0_tplv-k3u1fbpfcp-watermark](http://120.27.242.14:9900/uploads/upload_fefbe031b05c6bdbcaa38adf96f904c7.png)

## 几个主要的 api

* getUserMedia (Promise) ：获取音频和视频流
* RTCPeerConnection ：点对点通讯
* RTCDataChannel ：数据通信





## P2P 连接

* 利用 `socket.io` `socket.io-client` 通过信令服务器进行交互数据
* 连接流程即如上，直接使用默认自动生成的 ICE 配置



# WebSocket vs WebRtc

* 基于协议不同

  WebSocket 是基于 TCP 而 WebRTC 基于 UDP











# IM 开发

客户端发送消息给服务器，服务器存储转发消息给各个客户端



## 心跳检测与确认检测

心跳检测是为了与服务端保持长连接的保活策略

确认检测是为了客户端发送的数据能可靠到达服务端的策略

具体实现：

客户端没有发送消息后 5s 自动向服务端发送一个 PING 包，利用一个变量存储服务端没有返回 PING 包以及没有返回确认消息的总条数 `noResponse` ，当条数超过2时候就出发断线重连机制。在此过程客户端只要收到服务端的消息就将总条数清空。

服务端从连接建立就开始一个倒计时 7s 的摧毁连接计时器，也就是当服务端 7s 内没有收到客户端传来的消息就认为连接断开。





## 消息 id 如何生成

核心满足两个

* 全局唯一（保证消息的唯一性）
* 有序（保证消息的有序性）

 服务端为消息分配一个递增的 id 

项目中客户端会自我生成一个临时消息 id 即 `temp_message_id` 用于标识发送但未收到服务器确认的消息，当服务器收到该消息时候会为其分配一个真实的消息 id 即 `message_id` ，然后返回确认消息包。

客户端收到该确认消息为对应确认消息报中 `temp_message_id` 的消息添加上真实的 `message_id` 。

## 如何保证消息的有序性

客户端存储一个目前最大消息 id  `max_message_id` ，如果收到的消息比其大就直接 push 并更新变量，否则就插入到合适的位置。

客户端发送消息时候由于并不知道该消息的真实 id 所以也直接 push ，等到收到真实的消息 id 时候再进行调整位置



## 如何保证消息传输的可靠性

前端发送给服务器，服务器返回确认消息给前端，说明前端的消息已经可靠传输给服务器，那么此时可靠性的工作就代理给服务器，服务器向其他客户端转发，客户端需要回传确认消息。

使用队列结构来存储未确认的消息



### 保证客户端发送给服务端的消息可靠

保证客户端发送给服务端的消息可靠唯一标志就是客户端收到服务端返回的确认消息

以下两种情况客户端都会触发重传机制

* 客户端发送消息，客户端一定时间内没有收到所以没有回传确认消息
* 客户端发送消息，服务端回传的给客户端的确认消息客户端没有收到



### 发送消息的客户端的具体技术实现

客户端需要维护几个数据结构

* temp_id 与确认标志位 map ：用于给用户显示该消息发送成功与否（需要三个状态，00 正在发送 01 成功 02 失败）
* temp_id 与计时器 map ：用于监听以上第一种情况，客户端是否在一定时间内收到回传消息，如果没有收到就触发计时器( setTimeout )内语句（修改确认标志位为 false ）
* temp_id 与消息内容 map ：用于存储待确认消息的内容副本方便实现重发

**消息的 temp_id 如何生成**

temp_id 需要保证唯一性，所以这里直接使用时间戳来实现

**消息的有序怎么办** 

发送消息此时只有 temp_id 没有真实的 message_id 所以进行排序的时候自动略过 temp_id 的消息。



### 保证客户端转发消息的可靠性

此时已经保证客户端发送消息给客户端的可靠性，此时将可靠性代理到客户端上，本质上是同理只是掺和了 redis 以及离线消息。



* 服务端先判断该消息是否已经转发过了，如转发过则回传确认消息不执行其他
* 客户端转发消息给特定用户，如果该用户不存在将该消息存入 redis 离线消息中
* 客户端转发消息给特定用户，启动确认消息的计时器 ( `setInterval` )，如果该用户在线就会一直进行这个计时器，直到收到确认消息或者该用户离线（转一）



### 客户端的可靠性的具体技术实现



* temp_id + user_id 的 set redis ：保证收到的消息不是重复的，不会为其相同的消息分配几个 message_id 
* message_id 与重发计时器的 Set ：倒计时结束触发重发机制
* message_id 与待确认的消息 hset redis ：消息备份以重发
* user_id 与 message 的离线消息 set redis ：离线消息推送  









### 总体流程

发送消息客户端 Sclient ，服务端 Server ，接收消息客户端 Rclient

Sclient

* Sclient 分配 temp_id 创建 message_id ，发送消息
  * 直接将其 push 到历史消息中
  * 添加该消息的 temp_id 到 temp_id 与确认标志位 map 中，确认标志位为 00 即待确认状态
  * 启动 temp_id 与确认消息倒计时
  * 存储该消息到 temp_id 与消息内容的 map 中
* 如果 Sclient 收到确认消息
  * 去除 temp_id 与确认标志 map 中相应的数据
  * 去除 temp_id 与确认消息倒计时 map 中的倒计时并去除该数据
  * 去除 temp_id 与消息内容中对应的数据
* 如果 Sclient 没有收到消息
  * 将 temp_id 与确认标志位 map 中的标志位置为 02 失败
  * 去除 temp_id 与消息倒计时 map 中的数据

* 如果用户此时点击重发
  * 修改确认队列中的状态
  * 添加 temp_id 与倒计时 map 数据

Server

* 收到 Sclient 消息
  * 检测该 user_id + temp_id 是否已经分配过了，如果没有则添加到 temp_id + user_id 的 set 中
  * 为其分配 message_id 以及时间戳字段
  * 将该消息存入到 message_id 与待确定消息中备份
  * 将该 message 添加到数据库中
* 转发消息
  * 定点投送消息，如果该用户不在线则存入该用户的离线消息的 redis 中
  * 添加 message_id 与重发倒计时 setInterval （反复重发）
* 收到 Rclient 确认消息
  * 取消重发倒计时并清空该数据
  * 去除待确认消息 hset 中对应的数据



Rclient

* 接收到数据
  * 返回确认消息
  * 判断是否已经接收了该数据，如接收过则不继续操作
  * 将其 message_id 添加到已有消息 id Set 中
  * 推入消息列表中，插入到合适的位置中





如何渲染消息 list

* 自己的消息是直接 push 进去的
  * 先判断消息是否只存在 temp_id ，如只存 temp_id ，判断是否在确认队列中（不再队列中说明是成功），判断确认队列中的状态来渲染状态
  
    





> 项目中只对用户发送的消息进行验证消息的确认机制。
>
> 心跳本身就有确认机制所以无需考虑，而 System 系统通知、Init 初始化消息、以及其他消息类型都不做消息确认机制。

## 离线消息如何推送

先考虑是客户端利用 api 拉还是服务端用 ws 推

项目中用推，即与在线消息一致，看作是服务端通过 ws 再发送消息给客户端















## 群聊消息设计

项目中使用扩散存

群聊消息的存储方式有两种

* 即扩散存：一个用户在群聊中发送消息，那么就存群聊内所有用户的接收消息的数据
* 即单一存：一个用户在群聊内发送消息，就只存该发送用户与消息的数据

技术细节具体实现

### 扩散存

只要一个用户在群聊里发送消息，服务端收到就会将其广播，如果有用户离线则将该待发送消息存入 redis 中待发送队列中。一旦有用户登录，客户端就会 api 请求服务器中 redis 的待发送队列中自己的待接收数据（服务端通过 ws 推送给客户端）

例子：群聊内总共 1k 人，200人不在线，那么此时 redis 待发送队列中就会存 200 条数据



### 单一存

只要一个用户在群聊里发送消息，服务端会广播，如果不在线，就将这条数据存入数据库中。

**数据库中存一个用户与群聊以及最后收到该群聊消息 id 的表**，那么当用户登录时候，服务端查找群聊中大于该用户最后收到消息 id 的消息同时将其返回给用户。







## 会话列表

会话列表中存在群聊或者用户，当有新消息时候该会话就会爬升到最上面。

**后端**

用 redis 的 zset 来存储每个用户的会话列表，某个会话（某个用户的联系人/群聊）有发送消息或者收到消息时候将其 score 变为最大值

**前端**

只在初始化时候获取一次该列表，如果收到/发送消息，前端自己进行调整会话列表的顺序

notice_num 在收到用户消息时候自动将 activeChat 的数目清空，如果不是 activeChat 就数目++

每切换 activeChat 时候就将对应的 notic_num 清空



## 部分未实现

* 时间块的显示，即如何设计

* websokcet 连接验证身份

* 消息加密

* udp 和 tcp

  ![image-20211114153543200](http://120.27.242.14:9900/uploads/upload_b9ed7af0e4372c9339fe096781a8219e.png)

  








# 前端开发





## UI

![image-20211117161907323](http://120.27.242.14:9900/uploads/upload_7aed76fb39fe2d7786d5613bf2fe77e4.png)



## 登录逻辑

如果存在则返回数据，如果不存在则注册并返回数据



### 加好友/群逻辑

出现浮层，搜索名字出现列表

### 时间显示

当前这条消息如果距离上一条消息的时间差超过2分钟就显示，



## 收到 IM 消息

* 根据 chat_type 来推送到不同的历史消息中
* 显示当前会话未读数目
* 将收到该消息的会话提升到



## IM 消息渲染



### 发送的 input 

项目使用 [wangEditor](https://github.com/wangeditor-team/wangEditor) 该库来实现



### 收到的消息如何渲染

直接使用 `v-html` 





### 搜索好友

后端模糊搜索返回全部，前端请求全部联系人，判断这些是否再联系人中，如果不再就可以加为好友

### 搜索群

与搜索好友一致

### 创建群

直接创建

​	





# 需求分析和数据库设计



## redis 结构

这里以前缀名来形成 “表”

```js
 * 0. 存放 message_id 变量 key 命名：`message_id` value 就单一的 message_id
 * 1. 用户会话列表的 redis , key 命名： `conversation:chat_room_${user_id}` value: Zset
 * 2. 用户离线消息的 redis , key 命名：`offline:offline_message_${user_id}` value: List
 * 3. 服务端已收到消息与 message_id 对应的 redis , key 命名：`message:${user_id}_${temp_id}` value: message_id
 * 4. message_id 与待确认消息备份 redis , key 命名：`temp:${message_id} value: ${message}
```







### 用户会话列表  zset

```sql
key : chat_room_[user_id]
value : [{contacter_id:contacter_id}] | [{block_id:block_id}]
# example 
# value: {"contacter_id":"2"}
```



### 离线消息列表

```sql
key : offline_message_[user_id]
value : [MessageProp] # 见 ts 类型
```







## 表结构设计

这里 `block_message_id` `message_id` 逻辑上是相同的都是消息 id ，意味着者两者的值不会相同，都是全局唯一的。

```sql
use vze_db

create table user
(
    user_id   int primary key auto_increment,
    user_name VARCHAR(20) NOT NULL default 'suger',
    user_img  VARCHAR(1000)        default 'http://qianlon.cn/upload/2021/11/image-c571dd25ab744ff0a954fae2cfe5b61a.png'
);

# 用户与联系人关联表
create table user_contacter
(
    user_id      int,
    contacter_id int,
    foreign key (user_id) references user (user_id),
    foreign key (contacter_id) references user (user_id)
);

create table user_contacter_message
(
    contacter_message_id int primary key auto_increment,
    user_id              int,
    contacter_id         int,
    message              TEXT,
    send_time            timestamp not null default current_timestamp,
    foreign key (user_id) references user (user_id),
    foreign key (contacter_id) references user (user_id)
);
# 群
create table block
(
    block_id   int primary key auto_increment,
    block_name VARCHAR(30) NOT NULL,
    owner_id   int default 1,
    foreign key (owner_id) references user (user_id)
);

# 群和用户表
create table block_user
(
    block_id int,
    user_id  int,
    foreign key (block_id) references block (block_id),
    foreign key (user_id) references user (user_id)
);


# 群消息
create table block_message
(
    block_message_id int primary key auto_increment,
    block_id         int,
    user_id          int,
    at_user_id       int,
    message          TEXT,
    send_time        timestamp not null default current_timestamp comment '创建时间',
    foreign key (block_id) references block (block_id),
    foreign key (user_id) references user (user_id),
    foreign key (at_user_id) references user (user_id)
);

# mock
insert into user (user_name)
values ('千泷');
insert into user (user_name)
values ('小千');
insert into user (user_name)
values ('小泷');

insert into user_contacter value (2, 3);

select *
from user;

insert into block (block_name, owner_id)
values ('Vze 家族', 1);

insert into block_user
values (1, 1);
insert into block_user
values (1, 2);
insert into block_user
values (1, 3);
```

#### 视图创建









# 中途出现的问题

## 前后端同端口，却被后端解析了



## 跨域问题

前端解决，主要是 `transports `， `transports ` 是底层建立连接的方式，主要有 http 的轮询或者 websocket 。websocket 没有同源限制。

```js
import io from "socket.io-client";

// 解决跨域问题
// const connectionOptions = {
//   "force new connection": true,
//   reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
//   timeout: 10000, //before connect_error and connect_timeout are emitted.
//   transports: ["websocket"],
// };
// const socket = io("http://localhost:3100", connectionOptions);
```

后端解决

```js
  socket(app, {
    // 解决跨域， v3 之后的必须显式声明
    cors: {
      origin: "*",
      method: ["GET", "POST"],
      credentials: true,
    },
  }).on("connection", (sock: any) => {
    console.log(sock);
    console.log("-----------");
  });
```



## Vue cli

`vue-cli@4` 创建的项目无法热加载即保存文件浏览器无法自动刷新

vue-loader 插件问题，删除 `node_modules` 再 yarn 即可





## nextTick 中 vuex 仍然未初始化



直接 import store 可用，但是使用 useStore 就是 undfined

即 useStore 能否在文件中直接使用



### node-mysql 符号冲突

如果存入 mysql 的字符内有 `" '`  就会发生冲突





# Refrence

* https://juejin.cn/post/6896045087659130894
* [NAT 详解](https://www.cnblogs.com/ssyfj/p/14791064.html#%E4%B8%80nat%E4%BD%BF%E7%94%A8%E6%A1%88%E4%BE%8B)
* https://juejin.cn/post/6844903624561147918
* http://www.52im.net/thread-1616-1-1.html
* https://juejin.cn/post/6844903785731457032
* http://www.52im.net/thread-1998-1-1.html
* http://www.52im.net/thread-2747-1-1.html
* http://www.52im.net/thread-753-1-1.html
* https://juejin.cn/post/6964571538729205773
* https://socket.io
* https://zhuanlan.zhihu.com/p/63662433
* .....

