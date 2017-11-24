node {
  stage('Building Test Env') {
    sshagent(['fcf9b555-157a-4a9b-826c-0bfd00a5c836']) {
                sh 'ls ~/.ssh'
                sh 'ssh ubuntu@128.31.25.143'
                sh 'mkdir chicken_scat'
    }
  }
}