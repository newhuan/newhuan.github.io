# Debian Shadowsocks搭建

https://github.com/newhuan/shadowsocks-libev

```bash
sudo apt update
sudo apt install shadowsocks-libev

# Edit the configuration file
sudo vim /etc/shadowsocks-libev/config.json

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