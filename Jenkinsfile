pipeline {
    agent any
    stages {
        stage('Build and Deploy') {
            steps {
                echo 'Deteniendo servicios actuales...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-info && docker compose down'

                echo 'Obteniendo últimas actualizaciones...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-info && git pull origin master'

                echo 'Construyendo y levantando contenedores...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-info && docker compose up --build -d'
            }
        }
    }
}