pipeline {
    agent any

    stages {
        stage('Building Test Env') {
            steps {
                sh 'ls'
                sh 'ssh -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.143'
                sh 'mkdir chicken_scat'
                sh 'ls'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}