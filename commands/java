 debian 添加新的jdk
 update-alternatives命令详解： https://jingyan.baidu.com/article/ff42efa92a64c9c19e2202d2.html
 
 steps:
 1. 解压缩jdk文件并移动到/usr/lib/jvm或其他任意目录： unzip jdk to /usr/lib/jvm (or other path)
 2. 查看当前机器的java软链接：  sudo update-alternatives --list java
    这条命令会列出当前所有java可用版本， 如果要在已有版本之间切换，可以直接 sudo update-alternatives --config java 选择已有的jdk版本
 *3. 将新的jdk path注册到alternatives: sudo update-alternatives --install /usr/bin/java java [new version jdk path]/bin/java 300
    --install <链接> <名称> <路径> <优先级>
    [new version jdk path]表示刚才解压缩的jdk的路径如： /opt/zulu8.33.0.1-jdk8.0.192-linux_x64/bin/java
 4. 新的软链接注册之后就可以使用--config去选择jdk版本了，此时再使用sudo update-alternatives --config java 就可以选择jdk版本了，
 5. 之后运行java -version可以查看当前的java版本
