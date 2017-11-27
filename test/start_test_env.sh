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
echo "Pulling and checking out the new branch addition..."
git pull origin adding-jenkins
git checkout adding-jenkins
echo "Installing requirements.txt..."
sudo -H pip install -r requirements.txt
bash ~/108/test/karma_setup.sh
exit
EOSSH