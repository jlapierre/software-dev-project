echo "Installing nodejs..."
sudo apt-get -qq install nodejs
echo "Installing libfontconfig for phantomjs..."
sudo apt-get -qq install libfontconfig
echo "Installing package.json dev dependencies..."
npm install karma-phantomjs-launcher --unsafe-perm
npm install --only=dev --ignore-scripts