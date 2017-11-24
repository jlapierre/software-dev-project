node {
  stage('Building Test Env') {
    sshagent(['cs4500-admin']) {
                sh 'ssh -vvv -o StrictHostKeyChecking=no ubuntu@128.31.25.143 uname -a'
                sh 'mkdir chicken_scat'
    }
  }
}