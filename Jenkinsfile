pipeline {
    agent any

    stages {
        stage('Run Python Unit Tests') {
            steps {
                ./test/python_feature_tests.sh
            }
        }
        stage('Run Karma Tests') {
            steps {
                ./test/karma_setup.sh
                sh 'karma start'
            }
        }
        stage('Deploy Test Environment') {
            steps {
                sh 'ssh -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.143'
                echo 'add -tt and pipe in script later'
            }
        }
        stage('Run Integration Tests') {
            steps {

            }
        }
        stage('Deploy to Production') {
            steps {

            }
        }
    }
}