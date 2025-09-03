# School Management App

A modern web application for managing school information, built with Next.js 15 and MySQL database. This app allows users to add new schools with details and images, and view a list of all registered schools.

## Features

- **Add Schools**: Submit school information including name, address, city, state, contact details, email, and upload school images
- **View Schools**: Browse through a list of all registered schools with their details and images
- **Image Upload**: Support for uploading and storing school images
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Form Validation**: Client-side validation using React Hook Form and Zod
- **Animations**: Smooth animations powered by Framer Motion

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Validation**: Zod
- **Forms**: React Hook Form
- **Animations**: Framer Motion
- **TypeScript**: JavaScript (with JSConfig)

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 18 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd school-management-app
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

Create a `.env.local` file in the root directory and add your database configuration:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=school_management
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
```

## Database Setup

1. Create a MySQL database named `school_management`
2. The application will automatically create the required `schools` table on first run

The `schools` table structure:
```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    contact VARCHAR(255),
    email_id VARCHAR(255),
    image VARCHAR(255)
);
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Documentation

### Add School
- **Endpoint**: `POST /api/add-schools`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `name` (string, required): School name
  - `address` (string): School address
  - `city` (string): City
  - `state` (string): State
  - `contact` (string): Contact number
  - `email_id` (string): Email address
  - `image` (file, required): School image file

### Get Schools
- **Endpoint**: `GET /api/get-schools`
- **Response**: JSON array of schools with id, name, address, city, and image path

## Project Structure

```
school-management-app/
├── public/
│   ├── images/
│   └── schoolimage/          # Uploaded school images
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── add-schools/
│   │   │   └── get-schools/
│   │   ├── add-school/
│   │   ├── schools/
│   │   └── ...
│   └── lib/
│       └── db.js             # Database connection utility
├── package.json
├── next.config.mjs
└── README.md
```

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue in the GitHub repository.
