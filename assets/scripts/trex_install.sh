cd /root
wget https://github.com/trexminer/T-Rex/releases/download/0.26.8/t-rex-0.26.8-linux.tar.gz
mkdir trex
tar -xvzf t-rex-0.26.8-linux.tar.gz --directory trex
cp /root/dcim/assets/services/trex.service /etc/systemd/system/trex.service
systemctl enable trex
systemctl start trex