cd /root
git clone https://github.com/skzap/dcim.git
cd dcim
npm install
cp assets/services/dcim.service /etc/systemd/system/dcim.service
systemctl daemon-reload
systemctl enable dcim
systemctl start dcim