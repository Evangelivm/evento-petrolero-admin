pipeline {
    agent any
    stages {
        stage('Build and Deploy') {
            steps {
                echo 'Deteniendo servicios actuales...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-admin && docker compose down'

                echo 'Obteniendo últimas actualizaciones...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-admin && git pull origin master'

                echo 'Verificando archivo .env...'
                sh '''
                if [ ! -f /var/jenkins_home/workspace/evento-petrolero-admin/.env ]; then
                  echo "Copiando .env desde /var/jenkins_home/envs/evento-petrolero-admin.env"
                  cp /var/jenkins_home/envs/evento-petrolero-admin.env /var/jenkins_home/workspace/evento-petrolero-admin/.env
                else
                  echo ".env ya existe"
                fi
                '''

                echo 'Construyendo y levantando contenedores...'
                sh 'cd /var/jenkins_home/workspace/evento-petrolero-admin && docker compose up --build -d'
            }
        }
    }
}