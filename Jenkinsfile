pipeline {
    agent any
    environment {
        BREVO_API_KEY = credentials('brevo-api-key')
        MAIL_NAME = credentials('mail-name')
        MAIL_SUBJECT = credentials('mail-subject')
        NEXT_PUBLIC_API_URL = credentials('next-public-api-url')
    }
    stages {
        stage('Preparar entorno') {
            steps {
                echo '🔹 STAGE 1: Deteniendo contenedores anteriores y limpiando'
                sh '''
                cd /var/jenkins_home/workspace/evento-petrolero-admin
                docker compose down || echo "No había contenedores corriendo"
                '''
            }
        }
        
        stage('Obtener código') {
            steps {
                echo '🔹 STAGE 2: Obteniendo última versión del código'
                sh '''
                cd /var/jenkins_home/workspace/evento-petrolero-admin
                git pull origin master
                echo "✅ Código actualizado"
                '''
            }
        }
        
        stage('Construir imagen') {
            steps {
                echo '🔹 STAGE 3: Construyendo imagen Docker con variables de entorno'
                sh '''
                cd /var/jenkins_home/workspace/evento-petrolero-admin
                docker compose build --no-cache \
                    --build-arg BREVO_API_KEY=${BREVO_API_KEY} \
                    --build-arg MAIL_NAME=${MAIL_NAME} \
                    --build-arg MAIL_SUBJECT=${MAIL_SUBJECT} \
                    --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
                echo "✅ Imagen construida exitosamente"
                '''
            }
        }
        
        stage('Desplegar') {
            steps {
                echo '🔹 STAGE 4: Iniciando contenedores'
                sh '''
                cd /var/jenkins_home/workspace/evento-petrolero-admin
                docker compose up -d
                echo "🚀 Aplicación desplegada en http://<tu-servidor>:3002"
                '''
            }
        }
        
        stage('Verificación') {
            steps {
                echo '🔹 STAGE 5: Comprobando estado del contenedor'
                sh '''
                cd /var/jenkins_home/workspace/evento-petrolero-admin
                docker ps --filter "name=app" --format "{{.Status}}"
                '''
                echo "✔️ Pipeline completado"
            }
        }
    }
    
    post {
        failure {
            echo '❌ Pipeline fallido - Revisar logs'
            slackSend channel: '#alertas', message: "Falló el deploy de evento-petrolero-admin: ${BUILD_URL}"
        }
        success {
            echo '🎉 ¡Despliegue exitoso!'
        }
    }
}