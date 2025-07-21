# HUSTCODE FRONTEND

## Description

The HustCode Frontend is the frontend for a coding platform. It provides the necessary folder structure and configuration setup to kickstart your frontend development for the HustCode project.

## Prerequisites

Before using this frontend template, make sure you have the following installed:

- Node.js: You can download and install Node.js from the official website.

- Yarn: A fast, reliable, and secure dependency management tool for JavaScript.

To use the HustCode Frontend template, follow these steps:

#### 1. Clone the repository:

```sh
git clone https://github.com/UnderTheHoodDev/hustcode-frontend.git
```

#### 2. Navigate to the project directory:

```sh
cd hustcode-frontend
```

#### 3. Copy the `.env.example` file to `.env` and fill in the necessary information.

```sh
cp .env.example .env
```

## Start development

#### 1. Install dependencies:

```sh
yarn install
```

#### 2. Start the development server:

```sh
yarn dev
```

#### 3. Open your browser and visit [http://localhost:3000](http://localhost:3000)

## Prepare API Documents

#### 1. If your machine has Docker installed then you run the command below to generate OpenAPI

```docker
docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/api/specs/api.json\
  -g typescript-axios \
  -o /local/src/api/client
```

#### or you can run manually with this command if you don't have docker

```yarn
yarn generate-api
```

#### 2. Please run this command every time you update the `api/specs/api.yml` file
