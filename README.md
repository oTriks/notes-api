# Notes API

The Notes API allows users to manage notes, including creating, updating, deleting, restoring, and retrieving notes. Each note is tied to a specific user and requires authentication.

## Insomnia Configuration File Location
`insomnia_config.json` file is located in the `config` folder of this project.

## Base URL
```plaintext
https://89gqosrb3f.execute-api.eu-north-1.amazonaws.com/dev/
```

## Endpoints Overview

| Endpoint             | Method | Description                               | Requires Authentication |
|----------------------|--------|-------------------------------------------|-------------------------|
| `/api/user/signup`   | POST   | Register a new user                       | No                      |
| `/api/user/login`    | POST   | Log in and receive a JWT token            | No                      |
| `/api/notes`         | GET    | Retrieve all notes for the logged-in user | Yes                     |
| `/api/notes`         | POST   | Create a new note                         | Yes                     |
| `/api/notes`         | PUT    | Update an existing note                   | Yes                     |
| `/api/notes`         | DELETE | Mark a note as deleted                    | Yes                     |
| `/api/notes/restore` | POST   | Restore a previously deleted note         | Yes                     |

### 1. Register user
- **Endpoint**: `/api/user/signup`
- **Method**: `POST`
- **Description**: Register a new user by providing an email and password.

#### Example Request Body
```plaintext
{
  "email": "test@example.com",
  "password": "yourpassword"
}
```
#### Response
| Status Code	| Description                           | 
|-------------|---------------------------------------|
| 201         | User created successfully.            |
| 400         | Invalid input or user already exists. |
| 500         | Internal Server Error.                |

#### Example Success Response 201
```plaintext
{
  "message": "User created successfully."
}
```
#### Example Error Response 400
```plaintext
{
  "message": "User already exists."
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not create user. Please try again later."
}
```

### 2. Log in
- **Endpoint**: `/api/user/login`
- **Method**: `POST`
- **Description**: Log in an user by providing email and password to receive a JWT token for authentication.

#### Example Request Body
```plaintext
{
  "email": "test@example.com",
  "password": "yourpassword"
}
```
#### Response
| Status Code	| Description                                     | 
|-------------|-------------------------------------------------|
| 200         | Returns a JWT token for authentication.         |
| 400         | Invalid input (e.g., missing fields).           |
| 401         | Invalid credentials (incorrect email/password). |
| 500         | Internal Server Error.                          |

#### Example Success Response 200
```plaintext
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
#### Example Error Response 400 
```plaintext
{
  "message": "Email is required."
}
```
#### Example Error Response 401 
```plaintext
{
  "message": "Invalid credentials."
}
```
#### Example Error Response 500 
```plaintext
{
  "message": "Could not log in. Please try again later."
}
```

### 3. Retrieve notes
- **Endpoint**: `/api/notes`
- **Method**: `GET`
- **Description**: Retrieve all notes for the currently logged-in user. 

#### Authorization
- Use the Auth tab and select Bearer Token.
- Provide the JWT token returned from the /api/user/login endpoint.
  
#### Response
| Status Code	| Description                                                      | 
|-------------|------------------------------------------------------------------|
| 200         | Returns an array of notes for the user.                          |
| 401         | Unauthorized (e.g., missing/invalid JWT).                        |
| 502         | Bad Gateway (e.g., API Gateway misconfiguration or token issue). |
| 500         | Internal Server Error.                                           |

#### Example Success Response 200
```plaintext
[
  {
    "noteId": "12345",
    "title": "My First Note",
    "text": "This is the content of my note.",
    "createdAt": "2024-11-25T14:23:00.000Z",
    "modifiedAt": "2024-11-25T14:23:00.000Z"
  },
]
```
#### Example Error Response 401
```plaintext
{
  "message": "Unauthorized"
}
```
#### Example Error Response 502
```plaintext
{
  "message": "Internal server error"
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not retrieve notes. Please try again later."
}
```

### 4. Create note
- **Endpoint**: `/api/notes`
- **Method**: `POST`
- **Description**: Create a new note for the logged-in user.

#### Example Request Body
```plaintext
{
  "title": "My Note Title",
  "text": "This is the content of the note."
}
```
#### Authorization
- Use the Auth tab and select Bearer Token.
- Provide the JWT token returned from the /api/user/login endpoint.
  
#### Response
| Status Code	| Description                               | 
|-------------|-------------------------------------------|
| 201         | Note created successfully.                |
| 400         | Invalid input (e.g., missing fields).     |
| 401         | Unauthorized (e.g., missing/invalid JWT). |
| 500         | Internal Server Error.                    |

#### Example Success Response 201
```plaintext
{
  "message": "Note created successfully.",
  "noteId": "12345"
}
```
#### Example Error Response 400
```plaintext
{
  "message": "Text is required."
}
```
#### Example Error Response 401
```plaintext
{
  "message": "Unauthorized"
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not create note. Please try again later."
}
```

### 5. Update Note
- **Endpoint**: `/api/notes`
- **Method**: `PUT`
- **Description**: Update the title and/or text of an existing note. 

#### Example Request Body
```plaintext
{
  "noteId": "12345",
  "title": "Updated Note Title",
  "text": "Updated note content."
}
```
#### Authorization
- Use the Auth tab and select Bearer Token.
- Provide the JWT token returned from the /api/user/login endpoint.
  
#### Response
| Status Code	| Description                               | 
|-------------|-------------------------------------------|
| 200         | Note updated successfully.                |
| 400         | Invalid input (e.g., missing fields).     |
| 404         | Note not found.                           |
| 401         | Unauthorized (e.g., missing/invalid JWT). |
| 500         | Internal Server Error.                    |

#### Example Success Response 200
```plaintext
{
  "message": "Note updated successfully."
}
```
#### Example Error Response 400
```plaintext
{
  "message": "Note ID is required."
}
```
#### Example Error Response 401
```plaintext
{
  "message": "Unauthorized"
}
```
#### Example Error Response 404
```plaintext
{
  "message": "Note not found."
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not update note. Please try again later."
}
```

### 6. Delete Note
- **Endpoint**: `/api/notes`
- **Method**: `DELETE`
- **Description**: Mark a note as deleted.

#### Example Request Body
```plaintext
{
  "noteId": "12345"
}
```
#### Authorization
- Use the Auth tab and select Bearer Token.
- Provide the JWT token returned from the /api/user/login endpoint.
  
#### Response
| Status Code	| Description                               | 
|-------------|-------------------------------------------|
| 200         | Note marked as deleted.                   |
| 400         | Invalid input (e.g., missing fields).     |
| 404         | Note not found.                           |
| 401         | Unauthorized (e.g., missing/invalid JWT). |
| 500         | Internal Server Error.                    |

#### Example Success Response 200
```plaintext
{
  "message": "Note deleted."
}
```
#### Example Error Response 400
```plaintext
{
  "message": "Note ID is required."
}
```
#### Example Error Response 401
```plaintext
{
  "message": "Unauthorized"
}
```
#### Example Error Response 404
```plaintext
{
  "message": "Note not found."
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not delete note. Please try again later."
}
```

### 7. Restore Note
- **Endpoint**: `/api/notes`
- **Method**: `POST`
- **Description**: Restore a previously deleted note.

#### Example Request Body
```plaintext
{
  "noteId": "12345"
}
```
#### Authorization
- Use the Auth tab and select Bearer Token.
- Provide the JWT token returned from the /api/user/login endpoint.
  
#### Response
| Status Code	| Description                               | 
|-------------|-------------------------------------------|
| 200         | Note restored successfully.               |
| 400         | Invalid input (e.g., missing fields).     |
| 404         | Note not found or not deleted.            |
| 401         | Unauthorized (e.g., missing/invalid JWT). |
| 500         | Internal Server Error.                    |

#### Example Success Response 200
```plaintext
{
  "message": "Note restored successfully."
}
```
#### Example Error Response 400
```plaintext
{
  "message": "Note ID is required."
}
```
#### Example Error Response 401
```plaintext
{
  "message": "Unauthorized"
}
```
#### Example Error Response 404
```plaintext
{
  "message": "Note not found or not deleted."
}
```
#### Example Error Response 500
```plaintext
{
  "message": "Could not restore note. Please try again later."
}
```
