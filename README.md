# Notes API

The Notes API allows users to manage notes, including creating, updating, deleting, restoring, and retrieving notes. Each note is tied to a specific user and requires authentication.

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

#### Example Success Response
```plaintext
{
  "message": "User created successfully."
}
```
#### Example Error Response
```plaintext
{
  "message": "User already exists."
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

#### Example Success Response
```plaintext
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
#### Example Error Response
```plaintext
{
  "message": "Invalid credentials."
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
| Status Code	| Description                               | 
|-------------|-------------------------------------------|
| 200         | Returns an array of notes for the user.   |
| 401         | Unauthorized (e.g., missing/invalid JWT). |

#### Example Success Response
```plaintext
[
  {
    "noteId": "12345",
    "title": "My First Note",
    "text": "This is the content of my note.",
    "createdAt": "2024-11-25T14:23:00.000Z",
    "modifiedAt": "2024-11-25T14:23:00.000Z"
  },
  {
    "noteId": "67890",
    "title": "Another Note",
    "text": "More details about another note.",
    "createdAt": "2024-11-24T12:15:00.000Z",
    "modifiedAt": "2024-11-24T12:15:00.000Z"
  }
]
```
#### Example Error Response
```plaintext
{
  "message": "Unauthorized"
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

#### Example Success Response
```plaintext
{
  "message": "Note created successfully.",
  "noteId": "12345"
}
```
#### Example Error Response
```plaintext
{
  "message": "Invalid input."
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

#### Example Success Response
```plaintext
{
  "message": "Note updated successfully."
}
```
#### Example Error Response
```plaintext
{
  "message": "Note not found."
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

#### Example Success Response
```plaintext
{
  "message": "Note marked as deleted."
}
```
#### Example Error Response
```plaintext
{
  "message": "Note not found."
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
| 404         | Deleted note not found.                   |
| 401         | Unauthorized (e.g., missing/invalid JWT). |

#### Example Success Response
```plaintext
{
  "message": "Note restored successfully."
}
```
#### Example Error Response
```plaintext
{
  "message": "Note not found."
}
```
