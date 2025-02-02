## About The Project

A full stack web application that lets me manage my portfolio site by integrating with MongoDB Atlas and Amazon S3 where the content is stored

## Getting Started

### Prerequisites

To use this application, you will need accounts for the following services:

-   MongoDB Atlas
-   Amazon S3

### Installation

To install the application locally, run the following commands:

1. Clone the repository:

```sh
git clone https://github.com/jfang324/portfolio-admin-tool.git
```

2. Navigate to the project directory:

```sh
cd portfolio-admin-tool
```

3. Install the dependencies:

```sh
npm install --force
```

4. Create a `.env` file in the project directory and add the following environment variables:

```env
//use values provided after creating a bucket in s3
BUCKET_NAME = <bucket name>
BUCKET_REGION = <bucket region>
ACCESS_KEY = <bucket access key>
SECRET_ACCESS_KEY = <bucket secret access key>

//use values provided after creating a database in mongodb atlas
DB_USERNAME = <database username>
DB_PASSWORD = <database password>
DATABASE_URL = <url provided after creating and choosing to programatiically connect>
```

5. Start the application:

```sh
npm run build
npm run start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application

## Gallery & Demonstrations

<img src='https://github.com/user-attachments/assets/33e5924e-8182-4585-8157-f8c5a3f8c2c4'> </img>
_Homepage_

<img src='https://github.com/user-attachments/assets/455e8741-135a-4279-8015-91f08dd56882'> </img>
_Projects_

<img src='https://github.com/user-attachments/assets/70763da3-6860-4fcd-8e4d-aeea86be5fe5'> </img>
_Skills_

<img src='https://github.com/user-attachments/assets/bc2233f6-4da7-4d27-8eed-76e9bc90da61'> </img>
_Demos_

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Technologies

-   Next.js
-   React
-   Tailwind CSS
-   MongoDB Atlas
-   Amazon S3
-   shadcn/ui
