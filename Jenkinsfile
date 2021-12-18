#!/usr/bin/env groovy
pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        metadata:
          labels:
            package: flotel
        spec:
          containers:
          - name: node
            image: node:lts-stretch
            command:
            - sleep
            args:
            - 99d
        '''
    }
  }

    options {
        timestamps()
    }

    stages {
        stage('Install') {
            steps {
                container('node') {
                    script {
                        packageJson = readJSON file: 'package.json'
                        version = packageJson.version

                        echo "Setting build version: ${version}"
                        currentBuild.displayName = env.BUILD_NUMBER + ' - ' + version
                    }
                    sh 'yarn install'
                }
            }
        }

        stage('Build') {
            steps {
                container('node') {
                    sh 'yarn build'
                }
            }
        }

        stage('Test') {
            steps {
                container('node') {
                    sh 'yarn test'
                }
            }
        }
    }
}
