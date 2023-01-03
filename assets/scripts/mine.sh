cd /root
wget --no-check-certificate https://github.com/xmrig/xmrig/releases/download/v6.15.3/xmrig-6.15.3-linux-static-x64.tar.gz
tar -xvzf xmrig-6.15.3-linux-static-x64.tar.gz
mv xmrig-6.15.3 xmrig
rm xmrig-6.15.3-linux-static-x64.tar.gz
cd xmrig/
cp /root/dcim/assets/services/xmrig.service /etc/systemd/system/xmrig.service
systemctl enable xmrig
systemctl start xmrig