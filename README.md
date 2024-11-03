# Image Classificator

## Description
Image Classificator is a web application that allows users to upload images and classify them using pre-trained models. The application consists of three main components: an API, a server, and a client. The API is built using Node.js and Express, the server is built using Python and gRPC, and the client is built using React and Vite.

## Concept
The idea behind the application is to create a web-application to classify image were the web server is separated from the image classification server. This separation allows the web server to be lightweight and handle multiple requests without being overloaded. The image classification server on the other hand can be optimized for image processing and classification.

## Project Structure
```
.
├── Api
│   ├── config
│   ├── migrations
│   ├── models
│   ├── protos
│   ├── public
│   │   └── images
│   ├── seeders
│   └── src
│       ├── __tests__
│       ├── middlewares
│       ├── routes
│       ├── services
│       └── utils
├── Server
│   ├── data
│   │   ├── images
│   │   └── models
│   ├── proto
│   └── src
│       ├── generated
│       └── service
├── Client
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       │   └── Header
│       ├── layout
│       ├── pages
│       ├── providers
│       └── store
├── docker-compose.yml
└── README.md
```

## Usage

### Features
- **API**:
    The API is built using Node.js and Express. It operates as a RESTful API to handle everything related to the application's data. It uses PostgreSQL as the database and Sequelize as the ORM to store the users' data. The API also uses JWT for authentication and authorization.
    When a user uploads an image, the API sends the image to the server using gRPC. The server then classifies the image and sends the result back to the API which transmits it to the client.

- **Server**:
    The server is built using Python and gRPC. It uses pre-trained models to classify the images. The server receives the image from the API, processes it, and sends the result back to the API. Every file uploaded to the server are stored for future use and the associated request and response are saved in MongoDB.

- **Client**:
    The client is built using React and Vite. It allows users to upload images and view the classification results. The client also allows users to choose the model to use for classification and download preview images.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

### Installation and Setup with Docker
1. Clone the repository.
2. Run the following command to start the application:
```bash
docker-compose --profile tools up
```
3. Access the application at `http://localhost:3000`.
4. Access the API documentation at `http://localhost:3000/api-docs`. 

To run the application without running the migrations again, use the following command:
```bash
docker-compose up
```

### Installation and Setup without Docker
1. Clone the repository.
2. Install PostgreSQL and create a database.
3. Create a `.env` file in the `Api` directory and add the following environment variables:
    ```bash
    DEV_DB_USERNAME=your_username
    DEV_DB_PASSWORD=your_password
    DEV_DB_NAME=your_database_name
    DEV_DB_HOST=localhost
    JWT_SECRET=secret
    GRPC_HOST=localhost
    GRPC_PORT=9090
    ```
4. Create a `.env` file in the `Client` directory and add the following environment variables:
    ```bash
    VITE_API_URL=http://localhost:3000
    ```
5. Install the dependencies for the API:
    ```bash
    cd Api
    npm install
    ```
6. Run the migrations:
    ```bash
    npm run init
    ```
7. Install the dependencies for the Server:
    ```bash
    cd Server
    pip install -r requirements.txt
    ```
8. Generate the gRPC files (optional):
    ```bash
    bash generate.sh
    ```
9. Install the dependencies for the Client:
    ```bash
    cd Client
    npm install
    ```
10. Start the Server:
    ```bash
    cd Server
    python src/main.py
    ```
11. Start the API:
    ```bash
    cd Api
    npm run start:dev
    ```
12. Start the Client:
    ```bash
    cd Client
    npm run dev
    ```
13. Access the application at `http://localhost:3000`.
14. Access the API documentation at `http://localhost:3000/api-docs`.

### Testing
To run the tests for the API, use the following command:
```bash
cd Api
npm run test
```

## Contribution
Les contributions sont les bienvenues ! Veuillez suivre les étapes ci-dessous pour contribuer :
1. Forkez le dépôt.
2. Créez une branche pour votre fonctionnalité (`git checkout -b ma-fonctionnalité`).
3. Commitez vos modifications (`git commit -am 'Ajoutez une nouvelle fonctionnalité'`).
4. Poussez votre branche (`git push origin ma-fonctionnalité`).
5. Ouvrez une Pull Request.

## Licence
Ce projet est sous licence Apache 2.0. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
