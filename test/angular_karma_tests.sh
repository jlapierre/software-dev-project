ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
cd ~/108
echo "Starting karma tests..."
./node_modules/karma/bin/karma start
find . -name 'karma_coverage.txt' -exec cat {} \;
exit
EOSSH