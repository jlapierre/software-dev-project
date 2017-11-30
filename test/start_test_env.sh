ssh -T -o StrictHostKeyChecking=no -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.123 <<EOSSH
cd ~/108
echo "Updating app.run() to listen on port 80..."
sed -i 's/app.run(debug=True)/app.run(host="0.0.0.0", port=80, debug=False)/g' ~/108/src/run.py
echo "Starting the python server..."
sudo python ~/108/src/run.py >> log.txt 2>&1 &
exit
EOSSH