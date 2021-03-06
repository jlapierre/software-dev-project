# 108
section 1 team 8

## Setup Lint

To properly set up the pre-commit hooks to use Lint complete the following steps:
1. Install git lint 
$ pip install git-lint

2. Setup git to look at the correct git hooks
$ git config core.hooksPath hooks

3. Install the proper lint for the file type
$ pip install pep8
$ brew install libjpeg 
$ npm install csslint
$ npm install -g jshint
$ pip install html-linter

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
4. npm install 'karma-verbose-reporter' karma-coverage --save-dev
5. npm install -g karma-cli (You can either call karma from ./node_modules/karma/bin/karma, or install karma CLI)

## Running Frontend Tests
1. karma start (from the 108 directory)

## Running Lettuce Tests in Pycharm
1. Install Pycharm professional edition
2. Go under Project Settings > Languages and Frameworks > BDD
3. Select Lettuce
4. Right click on any .feature file and click Run to run that feature
