pipeline {
    agent any

    stages {
        stage('Setup Test Environment') {
            steps {
                sh "bash test/setup_test_env.sh ${env.BRANCH_NAME}"
            }
        }
        stage('Run Python Unit Tests') {
            steps {
                echo "bash test/python_feature_tests.sh ${env.BRANCH_NAME}"
            }
        }
        stage('Run Karma Tests') {
            steps {
                sh "bash test/angular_karma_tests.sh ${env.BRANCH_NAME}"
            }
        }
        stage('Deploy Test Environment') {
            steps {
                sh "bash test/start_test_env.sh ${env.BRANCH_NAME}"
            }
        }
        stage('Run Integration Tests') {
            steps {
                echo "This is where API calls will go..."
            }
        }
        stage('Deploy to Production') {
            steps {
                echo "This is where sh file to deploy to prod will go..."
            }
        }
    }
}