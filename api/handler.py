import os
import environ
import sys
sys.path.insert(0, '/opt')

env = environ.Env()
environ.Env.read_env()

def api_handler(event, context):
    os.environ['DEBUG'] = 'True'
    os.environ['SECRET_KEY'] = env.str('SECRET_KEY')
    os.environ['ALLOWED_HOSTS'] = '*'

    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()

    # Manejar solicitudes OPTIONS para CORS
    if event['httpMethod'] == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            },
            'body': ''
        }

    # Importar la función para manejar solicitudes WSGI
    from serverless_wsgi import handle_request
    # Manejar la solicitud y obtener la respuesta
    response = handle_request(application, event, context)

    # Agregar headers CORS a todas las respuestas
    if 'headers' not in response:
        response['headers'] = {}
    response['headers']['Access-Control-Allow-Origin'] = '*'
    response['headers']['Access-Control-Allow-Headers'] = 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    response['headers']['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'

    return response
