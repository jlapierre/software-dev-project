pipeline {
    agent any

    stages {
        stage('Setup Test Environment') {
            steps {
                sh "bash test/start_test_env.sh ${env.BRANCH_NAME}"
            }
        }
        stage('Run Python Unit Tests') {
            steps {
                sh "bash test/python_feature_tests.sh"
            }
        }
        stage('Run Karma Tests') {
            steps {
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
                echo 'This is where API calls will go...'
            }
        }
        stage('Deploy to Production') {
            steps {
                echo 'This is where sh file to deploy to prod will go...'
            }
        }
    }
}