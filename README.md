# SIH Project: 

### ID: sih-1669
#### Name: Transformo Docs Application - Empowering Machine-Readable Document Management System.
### Organization: Ministry of Electronics and Information Technology
#### Theme: Smart Automation

This project is an MVP (Minimum Viable Product)  that converts PDF files into text files. It consists of a frontend application hosted on Vercel and a backend service written in Go.

## Project Structure

- `transformo-ui/`: Frontend application (React/Next.js)
- `transformo-lib/`: Backend service (Go)

## Live Demo

- Demo: [https://transform-doc.vercel.app](https://transform-doc.vercel.app/)


## Local Development

### Prerequisites

- Node.js (v18 or later)
- Go (v1.16 or later)
- Git

### Setting up the Frontend

1. Navigate to the frontend directory:
   ```
   cd transformo-ui
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the `transformo-ui` directory and add the following:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

### Setting up the Backend

1. Navigate to the backend directory:
   ```
   cd transformo-lib
   ```

2. Install Go dependencies:
   ```
   go mod tidy
   ```

3. Start the Go server:
   ```
   go run main.go
   ```

   The backend API will be available at `http://localhost:8080`.

## Usage

1. Open your browser and go to `http://localhost:3000`.
2. Upload a PDF file using the provided interface.
3. The application will convert the PDF to text and display the result.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Adarsh-jaiss/sih-1669/blob/main/LICENSE) file for details.
