echo "Removing old 108 folder..."
ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 'sudo rm -rf ~/108'
echo "Copying all files onto remote server..."
scp -r . -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123:~/108
ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
echo "Installing pip..."
sudo apt-get -qq install python-pip
echo "Installing virtualenv..."
sudo apt-get -qq install virtualenv
echo "Killing any python scripts currently running..."
sudo pkill python
echo "Cd'ing into 108"
ls ~/
cd ~/108
echo "Installing requirements.txt..."
sudo -H pip install -r requirements.txt
cp ~/private.py ~/108/src/server/config/private.py
python ~/108/src/dev_seed.py <<EOF
y
EOF
bash ~/108/test/karma_setup.sh
exit
EOSSH