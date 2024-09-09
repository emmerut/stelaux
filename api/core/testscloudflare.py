import requests

url = "https://api.cloudflare.com/client/v4/accounts/98e818f2acdbe1a1949d43b94bac8157/registrar/domains"

headers = {
    "Authorization": "Bearer vNj78ikG07UJTbivUQ_X52wwtzAYgAnnIMbN8m6k",
     'X-Auth-Email': "developer@emmerut.com",
     'X-Auth-Key': "c463d945245590fa615eb7f479b8034564b12"
}

response = requests.get(url, headers=headers)

# Verifica si la solicitud fue exitosa (código de estado 200)
if response.status_code == 200:
    # Procesa la respuesta JSON
    data = response.json()
    print(data)
else:
    # Imprime un mensaje de error
    print("Error:", response.status_code)
    print(response.text)
