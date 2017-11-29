echo "Installing nodejs..."
sudo apt-get install nodejs
echo "Installing libfontconfig for phantomjs..."
sudo apt-get install libfontconfig
echo "Installing package.json dev dependencies..."
npm install karma-phantomjs-launcher --unsafe-perm
npm install --only=dev --ignore-scripts