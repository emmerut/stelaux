import requests

# Define los datos de la petición
data = {
    "AUTH_USER": "developer@emmerut.com",
    "AUTH_PWD": "Star112*",
    "SIMULATE": "true",
    "domain": "66de56c719293.com",
    "period": 1,
    "contacts": {
        "BillingFirstName": "Ruben",
        "BillingLastName": "Bouso",
        "BillingOrganizationName": "Dinahosting SL",
        "BillingLegalForm": 608,
        "BillingAddress1": "Salvadas, 41",
        "BillingCity": "Santiago de Compostela",
        "BillingStateProvince": "A Coruña",
        "BillingPostalCode": "15705",
        "BillingCountry": "ES",
        "BillingPhone": "+34.902090016",
        "BillingEmailAddress": "rbouso@dinahosting.com",
        "BillingIdentification": "12345678A",
        "BillingFax": "",
        "TechFirstName": "Ruben",
        "TechLastName": "Bouso",
        "TechOrganizationName": "Dinahosting SL",
        "TechLegalForm": 608,
        "TechAddress1": "Salvadas, 41",
        "TechCity": "Santiago de Compostela",
        "TechStateProvince": "A Coruña",
        "TechPostalCode": "15705",
        "TechCountry": "ES",
        "TechPhone": "+34.902090016",
        "TechEmailAddress": "rbouso@dinahosting.com",
        "TechIdentification": "12345678A",
        "TechFax": "",
        "AdminFirstName": "Ruben",
        "AdminLastName": "Bouso",
        "AdminOrganizationName": "Dinahosting SL",
        "AdminLegalForm": 0,
        "AdminAddress1": "Salvadas, 41",
        "AdminCity": "Santiago de Compostela",
        "AdminStateProvince": "A Coruña",
        "AdminPostalCode": "15705",
        "AdminCountry": "ES",
        "AdminPhone": "+34.902090016",
        "AdminEmailAddress": "rbouso@dinahosting.com",
        "AdminFax": "",
        "AdminIdentification": "12345678A",
        "RegistrantFirstName": "Ruben",
        "RegistrantLastName": "Bouso",
        "RegistrantLegalForm": 0,
        "RegistrantAddress1": "Prueba",
        "RegistrantCity": "Santiago de Compostela",
        "RegistrantStateProvince": "A Coruña",
        "RegistrantPostalCode": "15000",
        "RegistrantCountry": "ES",
        "RegistrantPhone": "+34.981040200",
        "RegistrantEmailAddress": "Prueba@dinahosting.com",
        "RegistrantIdentification": "12345678A",
        "RegistrantFax": ""
    },
    "dnss": [
        "ns.dinahosting.com",
        "ns2.dinahosting.com"
    ],
    "whoisProtection": 1,
    "showRegistrantInfoOnWhois": 0,
    "showAdminContactInfoOnWhois": 1,
    "showTechContactInfoOnWhois": 0,
    "paymentMethodType": "bono",
    "command": "Billing_Buy_Domain"
}

# Realiza la petición a la API
url = "https://dinahosting.com/special/api.php"
response = requests.post(url, data=data)

# Imprime la respuesta
print(response.text)