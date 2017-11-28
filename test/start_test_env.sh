ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
echo "Installing pip..."
sudo apt-get install python-pip
echo "Installing virtualenv..."
sudo apt-get install virtualenv
echo "Removing old 108 folder..."
sudo rm -rf 108
echo "Cloning 108 repo..."
git clone git@github.ccs.neu.edu:CS4500/108.git
cd ~/108
echo "Pulling and checking out $1..."
git checkout --track origin/$1
echo "Installing requirements.txt..."
sudo -H pip install -r requirements.txt
cp ~/private.py ~/108/src/server/config/private.py
python ~/108/src/dev_seed.py
bash ~/108/test/karma_setup.sh
exit
EOSSH