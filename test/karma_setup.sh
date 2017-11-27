curl -sL https://deb.nodesource.com/setup_3.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install karma --save-dev
npm install angular angular-route angular-mocks --save-dev
npm install karma-jasmine jasmine-core --save-dev
sudo npm install -g karma-cli