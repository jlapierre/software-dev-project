ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
cd ~/108
git checkout $1
echo "Starting a virtualenv..."
virtualenv .pyenv -p python2.7
. .pyenv/bin/activate
echo "Installing pip requirements..."
sudo -H pip install --quiet -r requirements.txt
echo "Starting feature tests..."
export PYTHONPATH="${PYTHONPATH}:/home/ubuntu/108/src"
export NUM_FEATURES=$(find test -type f -name \*.feature -type f -printf '.' | wc -c)
if [ "$NUM_FEATURES" != "0" ]; then lettuce test; else echo "No lettuce features to run!"; fi
coverage report
exit
EOSSH