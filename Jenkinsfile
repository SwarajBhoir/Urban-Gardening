pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/SwarajBhoir/Urban-Gardening.git'
        PROJECT_NAME = 'Urban-Gardening'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                bat "git clone $REPO_URL"
            }
        }

        stage('Build Docker Images') {
            steps {
                dir("${PROJECT_NAME}") {
                    bat 'docker-compose build'
                }
            }
        }

        stage('Start Containers') {
            steps {
                dir("${PROJECT_NAME}") {
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                bat 'docker ps -a'
            }
        }
    }
}