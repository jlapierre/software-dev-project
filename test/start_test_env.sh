ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
sudo apt-get install python-pip
sudo apt-get install virtualenv
sudo rm -rf 108
git clone git@github.ccs.neu.edu:CS4500/108.git
cd ~/108
git pull origin adding-jenkins
git checkout adding-jenkins
sudo -H pip install -r requirements.txt
bash ~/108/test/karma_setup.sh
exit
EOSSH