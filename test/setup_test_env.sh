ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
echo "Installing pip..."
sudo apt-get -qq install python-pip
echo "Installing virtualenv..."
sudo apt-get -qq install virtualenv
echo "Killing any python scripts currently running..."
sudo pkill python
echo "Removing old 108 folder..."
sudo rm -rf ~/108
echo "Creating 108 folder and untarring files..."
mkdir ~/108
mv remote ~/108
cd ~/108
tar -zxvf remote
echo "Installing requirements.txt..."
sudo -H pip install -r requirements.txt
cp ~/private.py ~/108/src/server/config/private.py
python ~/108/src/dev_seed.py <<EOF
y
EOF
bash ~/108/test/karma_setup.sh
exit
EOSSH