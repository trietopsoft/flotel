#!/usr/bin/env groovy
pipeline {

    agent any

    /*
     * Run everything on an existing agent configured with a label 'docker'.
     * This agent will need docker, git and a jdk installed at a minimum.

    agent {
        node {
            label 'docker'
        }
    }
     */
    // using the Timestamper plugin we can add timestamps to the console log
    options {
        timestamps()
    }

    environment {
        ARTIFACT = readMavenPom().getArtifactId()
        VERSION = readMavenPom().getVersion()
    }

    stages {
        stage('Install') {
            steps {
                // using the Pipeline Maven plugin we can set maven configuration settings, publish test results, and annotate the Jenkins console
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