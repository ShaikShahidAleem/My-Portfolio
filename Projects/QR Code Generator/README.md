# QR Code Generator

A simple Node.js application that generates QR codes from URLs entered by the user.

## Features

- Interactive command-line interface using Inquirer
- Generates QR code images from URLs
- Saves the entered URL to a text file for reference
- Uses ES6 modules for modern JavaScript syntax

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or download this project
2. Navigate to the project directory in your terminal
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the application:
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

2. When prompted, enter the URL you want to convert to a QR code
3. The application will:
   - Generate a QR code image saved as `qr_img.png`
   - Save the URL to `URL.txt` for future reference

## Output Files

- `qr_img.png` - The generated QR code image
- `URL.txt` - Text file containing the URL you entered

## Dependencies

- `inquirer` - For interactive command-line prompts
- `qr-image` - For QR code generation
- `fs` - Node.js file system module (built-in)

## Project Structure

```
QR Code Project/
├── index.js          # Main application file
├── package.json      # Project configuration and dependencies
├── package-lock.json # Dependency lock file
├── README.md         # This file
├── qr_img.png        # Generated QR code (created after running)
└── URL.txt           # Saved URL (created after running)
```

## How It Works

1. The application prompts the user for a URL using Inquirer
2. It generates a QR code image using the qr-image library
3. The QR code is saved as a PNG file
4. The URL is also saved to a text file for reference

## Author

Shaik Shahid Aleem

## License

ISC 