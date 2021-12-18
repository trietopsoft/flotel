#!/usr/bin/env groovy
pipeline {
    agent {
        docker { image 'node:16.13.1-alpine' }
    }

    options {
        timestamps()
    }

    stages {
        stage('Install') {
            steps {
                    script {
                        packageJson = readJSON file: 'package.json'
                        version = packageJson.version

                        echo "Setting build version: ${version}"
                        currentBuild.displayName = env.BUILD_NUMBER + ' - ' + version
                    }
                sh 'yarn install'
            }
        }

        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }

        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }
    }
}
