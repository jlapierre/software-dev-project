pipeline {
    agent any

    stages {
        stage('Building Test Env') {
            steps {
                sh 'ssh -vvv -o StrictHostKeyChecking=no ubuntu@128.31.25.143 uname -a'
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