<a id="readme-top"></a>

## About The Project

[![Product Name Screen Shot][main-image]](https://github.com/Diane-Choi/SUMMER_PROJECT_2024)

**My AI Stylist** is a web application that helps users generate stylish outfit combinations using AI. Users can select an item from their closet, and the AI will suggest matching clothes based on season and style.

### Key Features
- **AI-powered outfit generation:** Select a clothing item and choose categories (bottom, outer, shoes, etc.), and AI will match the best options from your closet.
- **Closet Management:** Store tops, bottoms, outers, shoes, bags, and accessories with images and information.
- **Season-based matching:** AI suggests only those items that fit the same season.
- **Recently Viewed Outfits:** View your last 5 generated outfits.
- **Replace outfit items:** Swap an item if you don't like the AI's suggestion.
- **Save Favorite Outfits:** Store your best outfits for future reference.




### Built With

* [![React][React.js]][React-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Express][Express]][Express-url]
* [![Node.js][Node.js]][Node-url]
* [![Nodemon][Nodemon]][Nodemon-url]
* [![AWS S3][aws-s3]][aws-s3-url]
* [![SQLite][SQLite]][SQLite-url]




<!-- GETTING STARTED -->
## Getting Started
### Prerequisites
Ensure you have the latest version of npm installed:
```sh
npm install npm@latest -g
```

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Diane-Choi/SUMMER_PROJECT_2024.git
   ```
2. Install dependencies for both backend and frontend:
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

### Environment Variables
Before running the project, create a `.env` file in the `backend/` directory and add the following variables:

```ini
BUCKET_NAME=
BUCKET_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
OPENAI_API_KEY=
```

Make sure to replace the values with your actual credentials.

## Running the Project
### Start Backend Server
From backend directory:
```sh
npm run dev
```

### Start Frontend Server
From frontend directory:
```sh
npm start
```

### Run Temporary JSON Database
Navigate to the database folder:
```sh
cd backend/src/database
```
Run JSON servers for favorite and closet items:
```sh
json-server --watch favouriteItems.json --port 3001
json-server --watch closetItems.json --port 3002
```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[main-image]: frontend/public/assets/logo.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Express]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Nodemon]: https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white
[Nodemon-url]: https://nodemon.io/
[SQLite]: https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white
[SQLite-url]: https://www.sqlite.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[aws-s3-url]: https://aws.amazon.com/s3/
[aws-s3]: https://img.shields.io/badge/AWS_S3-569A31?logo=amazons3&logoColor=fff&style=for-the-badge
