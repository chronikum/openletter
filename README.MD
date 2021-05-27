# Open Letter

Diese Software bietet ein Backend für eine simple Petitionsplattform.
User können Ihre E-Mail verifizieren, Briefe unterschreiben und selbst welche erstellen.

Es befindet sich in Entwicklung.

## Dokumentation


.env datei  
```
DATABASE_PATH  < database path
SMTP  < smtp host
USERNAME  < username email
PASSWORD  < username password
PORT  < email port
HOST  < website host with http(s) and port specification (if necessary). This will be also used as cors origin.
```

## API

All requests are POST.  

### Create a new letter  

```
host/letter/create
````

Example body data:
````
{
    "letter" : {
        "title": "Klimaschutz jetzt",
        "description": "Wir brauchen mehr Klimaschutz"
    }
}
````

### Get all letters

```
host/letter/getAll
````


### Sign a letter

````
host/sign/sign
````

Example body data:
````
{
    "signer": {
        "name": "Test User",
        "organization": "Open Letter",
        "email": "test@klimaschutz.lol",
        "verified": false,
        "signing": 2 
    }
}
````

### Get signee information for a letter (signees)

````
host/sign/getInfo
````

Example body data:
````
{
    "signer": {
        "identifier": 3
    }
}
````

More endpoints can be seen in the ``/routes`` folder


Lizenziert unter der MIT License