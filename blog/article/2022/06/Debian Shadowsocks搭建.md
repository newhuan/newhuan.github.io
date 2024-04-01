# Debian Shadowsocks搭建

https://github.com/newhuan/shadowsocks-libev

```bash
# 先在ECS的安全组中，把需要监听的TCP端口号（如:7676）添加白名单，然后再操作
sudo apt update
sudo apt install shadowsocks-libev

# Edit the configuration file
sudo vim /etc/shadowsocks-libev/config.json
{
    "server":["::1", "0.0.0.0"],# 注意，这里初始化是127.0.0.1,要改成0.0.0.0，表示监听外网
    "mode":"tcp_and_udp",
    "server_port":7676,
    "local_port":1080,
    "password":"tiger6666",
    "timeout":86400,
    "method":"chacha20-ietf-poly1305"
}

# Edit the default configuration for debian
sudo vim /etc/default/shadowsocks-libev

# Start the service
sudo /etc/init.d/shadowsocks-libev start    # for sysvinit, or
sudo systemctl start shadowsocks-libev      # for systemd

#=============================================================
# 方式二：Build deb package from source
# 安装GCC编译器:
apt-get install build-essential autoconf libtool libssl-dev gcc -y
# 安装git
apt-get install git -y
# 用git下载源码包:
# git clone 找个可用的git源，实在不行：https://github.com/newhuan/shadowsocks-libev
mkdir -p ~/build-area/
cp ./scripts/build_deb.sh ~/build-area/
cd ~/build-area
./build_deb.sh
```