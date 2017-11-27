echo "Installing nodejs..."
sudo apt-get install nodejs
echo "Installing npm..."
sudo apt-get install npm
echo "Installing karma..."
npm install karma --save-dev
echo "Installing angular..."
npm install angular angular-route angular-mocks --save-dev
echo "Installing karma local dependencies..."
npm install karma-jasmine jasmine-core --save-dev
echo "Installing karma-cli..."
sudo npm install -g karma-cli