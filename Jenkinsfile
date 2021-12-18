#!/usr/bin/env groovy
pipeline {
    agent any

    options {
        timestamps()
    }

    script {
        def packageJson = readJSON file: 'package.json'
        def version = packageJson.version

        echo "Setting build version: ${version}"
        currentBuild.displayName = env.BUILD_NUMBER + ' - ' + version
    }

    stages {
        stage('Install') {
            steps {
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
