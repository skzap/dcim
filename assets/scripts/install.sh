pacman -S lshw nodejs-lts-gallium npm
cd /root/dcim
npm install
cp /root/dcim/assets/services/dcim.service /etc/systemd/system/dcim.service
systemctl enable dcim
systemctl start dcim