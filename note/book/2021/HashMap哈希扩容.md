#### 背景介绍

threshold: 阈值

```java
// HashMap.java:662, JDK1.8
if (++size > threshold) // 当put后的size大于threshold时，发生一次哈希扩容
    resize();
```

#### 代码示例

```java
1 Map<Integer, Integer> testMap = new HashMap<Integer, Integer>(7, 0.4f);
2 testMap.put(1, 1);
3 testMap.put(2, 1);
4 testMap.put(3, 1);
5 testMap.put(4, 1);
```

##### 第一行时

```java
// HashMap.java:456
this.loadFactor = loadFactor;
this.threshold = tableSizeFor(initialCapacity);

// HashMap.java:378
static final int tableSizeFor(int cap) {
  int n = cap - 1;
  n |= n >>> 1; //>>> 无符号右移（符号位设置为0）
  n |= n >>> 2;
  n |= n >>> 4;
  n |= n >>> 8;
  n |= n >>> 16;
  return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

```java
// tableSizeFor方法详解
// tableSizeFor(int cap)是hashMap中的一个Static函数，主要功能是返回一个大于等于给定整数且最接近给定整数的2的幂次方整数，如给定7，返回2的3次方8、给定8，返回2的3次方8
// 原理解释：核心是用 |= 和 >>> 将32位int数的所有位数都设置为1
// 假定数字是128，二进制表示如下：
0b10000000
// n >>> 1 的值为0b01000000 , |=之后，值变为:
0b11000000
// n >>> 2 的值为0b00110000 , |=之后，值变为:
0b11110000
// n >>> 4 的值为0b00001111 , |=之后，值变为:
0b11111111
// 再之后 >>> 的值都为0， |= 不改变n的值
// 最后加1
// 32位int最大值时，最后一行保证threshold不会超过int范围
```

代码示例第一行之后，threshold被初始化为大于等于initialCapacity且最接近initialCapacity的2的幂次方整数，在示例代码的情况下，threshold被初始化为8;

#### 第二行时

第一次put操作,源代码如下，此时table为null,触发一次```resize```方法,```threshold``` 在702行被设置为 ```(int)(8 * 0.4f) => 3``` 

```Java
// HashMap.java:628, JDK1.8
if ((tab = table) == null || (n = tab.length) == 0) {
  n = (tab = resize()).length;
}
// HashMap.java:677, JDK1.8
677 final Node<K,V>[] resize() {
        Node<K,V>[] oldTab = table;
        int oldCap = (oldTab == null) ? 0 : oldTab.length; // 0
        int oldThr = threshold; // 8
        int newCap, newThr = 0;
        if (oldCap > 0) {
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                     oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1; // double threshold
        }
        else if (oldThr > 0) // initial capacity was placed in threshold
692          newCap = oldThr; // @tiger: newCap => 8
        else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        if (newThr == 0) {
698         float ft = (float)newCap * loadFactor; // @tiger: 8 * 0.4f = 3.2f
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE); // @tiger newThr = (int) 3.2f => 3
        }
702     threshold = newThr;
        @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;
        if (oldTab != null) {
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    if (e.next == null)
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }
```

#### 第五行时

第五行put后，hashMap的size编程了4，大于```threshold(3)``` ,再次出发了```resize``` 方法，触发了一次哈希扩容（上方resize方法中，702行后面的部分）

```Java
// HashMap.java: 662
if (++size > threshold)
    resize();
```



#### HashMap何时触发哈希扩容，计算出的新的capacity（即bucket数量）是多少？

构造函数会使用下面的方法初始化(456行)threshold（阈值）的值，即**大于等于initialCapacity且最接近initialCapacity的2的幂次方整数（不得大于**MAXIMUM_CAPACITY**）。**



然后在第一次调用put方法的时候，触发resize方法，讲初始capacity（bucket数量）设置为构造函数中初始化的threshold，然后将threshold设置为 (int)(threshold * loadFactor)



之后每次put的时候，如果新的bucket被占用（662行），会将占用的Bucket数量和threshold做比较，如果占用的bucket数量大于threshold,则会触发一次哈希扩容，新capacity的值如下规则：



1. DEFAULT_INITIAL_CAPACITY = 1 << 4 = 16
2. 如果旧的capacity大于等于MAXIMUM_CAPACITY，将新的threshold设置为Integer.MAX_VALUE,不触发哈希扩容

1. 如果旧的capacity小于MAXIMUM_CAPACITY，新的capacity为旧capacity << 1,即旧capacity * 2触发哈希扩容
2. 当原capacity小于DEFAULT_INITIAL_CAPACITY时，新的threshold为 (int)(新capacity * loadFactor)

1. 当原capacity大于DEFAULT_INITIAL_CAPACITY时，新的threshold为 旧的threshold << 1, 即 * 2

```Java
public HashMap(int initialCapacity, float loadFactor) ；
// MAXIMUM_CAPACITY: 1 << 30

  // HashMap.java:243, JDK1.8
static final int MAXIMUM_CAPACITY = 1 << 30;
// HashMap.java:378, JDK1.8
static final int tableSizeFor(int cap) {
  int n = cap - 1;
  n |= n >>> 1;
  n |= n >>> 2;
  n |= n >>> 4;
  n |= n >>> 8;
  n |= n >>> 16;
  return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}

// HashMap.java:456, JDK1.8
this.loadFactor = loadFactor;
this.threshold = tableSizeFor(initialCapacity);

// HashMap.java:662, JDK1.8
if (++size > threshold)
    resize();

```

