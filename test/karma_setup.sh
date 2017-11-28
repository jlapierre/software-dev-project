echo "Installing nodejs..."
sudo apt-get install nodejs-legacy
echo "Installing npm..."
sudo apt-get install npm
echo "Installing libfontconfig for phantomjs..."
sudo apt-get install libfontconfig
echo "Installing package.json dev dependencies..."
npm install --only=dev