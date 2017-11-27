ssh -tt -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 << EOF
sudo apt-get install python-pip
sudo apt-get install virtualenv
sudo rm -r 108
ssh-agent -s
ssh-add /home/ubuntu/.ssh/github-ccs
git clone git@github.ccs.neu.edu:CS4500/108.git
cd ~/108
git pull origin adding-jenkins
git checkout adding-jenkins
sudo pip install requirements.txt
bash ~/108/test/karma_setup.sh
EOF
