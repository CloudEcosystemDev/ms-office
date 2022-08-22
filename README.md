# Microsoft Graph Adapter

> Microsoft Graph Adapter for Open Integration Hub.

## Usage

1. register your app at https://portal.azure.com/
2. set redirect uri to https://app.elastic.io/callback/oauth2
3. set permissions **user.read, email, offline_access, openid, profile**
4. set register secret in secret service
5. add secret to flow step

## Actions

### 'addContact' (adds new contact) makes POST-request to https://graph.microsoft.com/v1.0/me/contacts
### If the entry has a category it will instead post the contact in a contact folder with the same name as the category

**Request:**
```json
{
    "companyName": "Test GmbH",
    "surname": "Max",
    "givenName": "Mustermann",
    "emailAddresses":
    {
        "name": "Max Mustermann",
        "address": "max.mustermann@agindo-software.de"
    },
    "businessPhones":
    [
        "+49 228 123 456"
    ]
}
```

**Response:**
```json
{
    "id": "1",
    "createdDateTime": "2019-03-01T08:15:45Z",
    "lastModifiedDateTime": "2019-03-01T08:15:45Z",
    "displayName": "Max Mustermann"
}
```

### 'checkEvents' (lists own events) makes GET-request to https://graph.microsoft.com/v1.0/me/events

**Response:**
```json
{
    "value":
    [
        {
            "id": "1",
            "subject": "Test-Event",
            "bodyPreview": "Lorem ipsum.",
            "body":
            {
                "contentType": "html",
                "content": "<html><head></head><body><p>Lorem ipsum.</p></body></html>"
            },
            "start":
            {
                "dateTime": "2019-03-01T10:00:00.0000000",
                "timeZone": "Pacific Standard Time"
            },
            "end":
            {
                "dateTime": "2019-03-01T12:00:00.0000000",
                "timeZone": "Pacific Standard Time"
            },
            "attendees":
            [
                {
                    "type": "required",
                    "status":
                    {
                        "response": "none",
                        "time": "0001-01-01T00:00:00Z"
                    },
                    "emailAddress":
                    {
                        "name": "Max Mustermann",
                        "address": "max.mustermann@agindo-software.de"
                    }
                }
            ],
            "organizer":
            {
                "emailAddress":
                {
                    "name": "Max Mustermann",
                    "address": "max.mustermann@agindo-software.de"
                }
            }
        }
    ]
}
```

### 'createEvent' (adds new event) makes POST-request to https://graph.microsoft.com/v1.0/me/calendars/XXX/events

**Request:**
```json
{
  "subject": "Test-Event",
  "body":
  {
      "contentType": "HTML",
      "content": "Lorem ipsum."
  },
  "start":
  {
      "dateTime": "2019-03-01T12:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "end":
  {
      "dateTime": "2019-03-01T14:00:00",
      "timeZone": "Pacific Standard Time"
  },
  "location":
  {
      "displayName": "agindo GmbH"
  },
  "attendees":
  [
    {
      "emailAddress":
      {
            "address": "max.mustermann@agindo-software.de",
            "name": "Max Mustermann"
      },
      "type": "required"
    }
  ]
}
```

**Response:**
```json
{
    "id": "1",
    "createdDateTime": "2019-03-01T03:00:50.7579581Z",
    "lastModifiedDateTime": "2019-03-01T03:00:51.245372Z",
    "originalStartTimeZone": "Pacific Standard Time",
    "originalEndTimeZone": "Pacific Standard Time",
    "reminderMinutesBeforeStart": "15",
    "isReminderOn": true,
    "subject": "Test-Event",
    "bodyPreview": "Lorem ipsum.",
    "importance": "normal",
    "sensitivity": "normal",
    "isAllDay": false,
    "isCancelled": false,
    "isOrganizer": true,
    "responseRequested": true,
    "seriesMasterId": null,
    "showAs": "busy",
    "type": "singleInstance",
    "responseStatus":
    {
        "response": "organizer",
        "time": "0001-01-01T00:00:00Z"
    },
    "body":
    {
        "contentType": "html",
        "content": "<html><head></head><body>Lorem ipsum.</body></html>"
    },
    "start":
    {
        "dateTime": "2019-03-01T11:00:00.0000000",
        "timeZone": "Pacific Standard Time"
    },
    "end":
    {
        "dateTime": "2019-03-01T12:00:00.0000000",
        "timeZone": "Pacific Standard Time"
    },
    "location":
    {
        "displayName": "agindo GmbH",
        "locationType": "default",
        "uniqueId": "agindo GmbH",
        "uniqueIdType": "private"
    },
    "locations":
    [
        {
            "displayName": "agindo GmbH",
            "locationType": "default",
            "uniqueIdType": "unknown"
        }
    ],
    "attendees":
    [
        {
            "type": "required",
            "status":
            {
                "response": "none",
                "time": "0001-01-01T00:00:00Z"
            },
            "emailAddress":
            {
                "name": "Max Mustermann",
                "address": "max.mustermann@agindo-software.de"
            }
        }
    ],
    "organizer":
    {
        "emailAddress":
        {
            "name": "Max Mustermann",
            "address": "max.mustermann@agindo-software.de"
        }
    }
}
```

## Triggers

### 'getContacts' (reads changed contacts or all if no snapshot exists) makes GET-request to https://graph.microsoft.com/v1.0/me/contacts and request for all existent contact folders

**Response:**
```json
{
    "contacts":
    {
        "id": "1",
        "createdDateTime": "2019-03-01T08:15:45Z",
        "lastModifiedDateTime": "2019-03-01T08:15:45Z",
        "companyName": "agindo GmbH & Co. KG",
        "displayName": "Max Mustermann"
    }
}

### 'contacts' (reads changed contacts) makes GET-request to https://graph.microsoft.com/v1.0/me/contacts

**Response:**
```json
{
    "contacts":
    {
        "id": "1",
        "createdDateTime": "2019-03-01T08:15:45Z",
        "lastModifiedDateTime": "2019-03-01T08:15:45Z",
        "companyName": "agindo GmbH & Co. KG",
        "displayName": "Max Mustermann"
    }
}
```

### 'messages' (lists own messages) makes GET-request to https://graph.microsoft.com/v1.0/me/messages

**Response:**
```json
{
  "value":
  [
    {
      "receivedDateTime": "2019-03-01T11:30:45.0000000",
      "sentDateTime": "2019-03-01T11:30:45.0000000",
      "hasAttachments": false,
      "subject": "Test-Mail",
      "body":
      {
        "contentType": "HTML",
        "content": "Lorem ipsum."
      },
      "bodyPreview": "Lorem ipsum."
    }
  ]
}
```

## Integrated Transformations

As of version 2.0.0, transformations to and from the OIH contact master data model are integrated into the relevant actions/triggers by default. This means that it is no longer necessary to run a separate MS Office Transformer in flows containing this Adapter.

If you would like to use the old behaviour without integrated transformations, simply set `skipTransformation: true` in the `fields` object of your flow configuration. Alternatively, you can also inject a valid, stringified JSONata expression in the `customMapping` key of the `fields` object, which will be used instead of the integrated transformation.

----------

*Copyright (c) 2019 agindo GmbH.*
