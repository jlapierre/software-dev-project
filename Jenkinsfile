pipeline {
    agent any

    stages {
        stage('Building Test Env') {
            steps {
                sh 'ssh -i ~/.ssh/cs4500-admin.pem ubuntu@128.31.25.143'
                sh 'mkdir chicken_scat'
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