# 108
section 1 team 8

## Directions for running the template
1. Make sure that flask and python is installed
2. cd src/server/config and cp private.py.example private.py
3. cd src
4. python run.py
5. Open a web browser and navigate to localhost:5000

## Setup for Running Frontend Tests
This process uses npm, so ensure that is properly installed
1. npm install karma --save-dev 
2. npm install angular angular-route angular-mocks --save-dev 
3. npm install karma-jasmine jasmine-core --save-dev
4. npm install -g karma-cli (You can either call karma from ./node_modules/karma/bin/karma, or install karma CLI)

## Running Frontend Tests
1. karma start