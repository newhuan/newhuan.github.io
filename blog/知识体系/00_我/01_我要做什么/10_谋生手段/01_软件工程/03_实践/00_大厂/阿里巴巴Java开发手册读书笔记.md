# 阿里巴巴Java开发手册读书笔记

### 20200830

单行文本字符数不超过120个

IDE换行符强制使用UNIX格式

```
String abc = "a,c,,,";
List arr = Arrays.asList(abc.split(","));
System.out.println(arr); // [a,c]
System.out.println(arr.size()); // 2
                    
```

Collections.singletonList和emptyList()都是immutable list

卫语句

```
if (condition) {
    // logic
    return
}
if (condtion2) {
    // logic2
    return
}
                    
```

给复杂的判断起一个有意义的变量名

```
boolean existed = conditionA && conditionB;
if (existed) {
    // balabala
}
                    
System.currentTimeMillis(); // 获取当前毫秒数，不要用　new Date().getTime();
                    
```

e.printStackTrace()容易造成文件体积超过系统大小限制

数据库表名不用复数，主键索引名为pk_,唯一索引名为uk_,普通索引名为idx_

如果存储的字符串长度几乎相等，则应该使用char定长字符串类型

varchar是**可变长**字符串，不预先分配存储空间，长度不要超过5000个字符，如果长度大于此值，则应该定义字段类型为text(long text),独立拉出一张表，用主键来对应，避免影响其他字段的索引效率。

冗余字段应该遵循：1. 不是频繁修改的字段. 2. 不是varchar超长字段，更不能是text字段

单表500万行，或者单表容量超过2GB时，才推荐进行分库分表

在varchar字段上建立索引时，必须指定索引长度，没必要对全字段建立索引，根据实际文本区分度决定索引长度即可。
索引的长度和区分度是一对矛盾体，一般对字符串类型数据，长度为20的索引，区分度会高达90%以上，可以使用count(distinct left(列名，　索引长度)) / count(*)的区分读来确定

MySQL的offset的实现是取offset+N行然后舍弃offset行。offset过大时的优化：先快速定位需要获取的id，然后再关联

```
SELECT a.字段 FROM 表1 a,(select id from 表1 where　条件 LIMIT 100000, 20) b where a.id = b.id;
                        
```



count(*), count(列名), count(1)在对NULL的处理上有所区别

用is开头的boolean列名在mybatis使用时会出现解析错误，所以需要在resultMap中做好映射。或者直接不用is_deleted改用being_deleted

对只可能是正整数的字段，使用unsigned int

fastjson处理JSON.commons-codec处理MD5.Guava工具集合。org.apache.commons.lang3不要用lang（不支持很多1.5,1.6以及之后的特性）

高并发服务器的系统设置，需要降低time_wait的时间，以快速关闭不用的连接:/etc/sysctl.conf: net.ipv4.tcp_fin_timeout = 30;
同时调大服务器所支持的最大文件句柄数

JVM的xms和xmx需要设置为一样的内存容量，避免GC后调整堆大小带来的压力