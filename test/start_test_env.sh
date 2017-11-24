ssh -tt -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 << EOT
sudo apt-get install python-pip
sudo apt-get install virtualenv
sudo rm -r 108
git clone git@github.ccs.neu.edu:CS4500/108.git
cd 108
git pull -u origin adding-jenkins
git checkout adding-jenkins
sudo pip install requirements.txt
bash test/karma_setup.sh
EOT