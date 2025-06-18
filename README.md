# Excel Comparison Tool

A modern web application for comparing Excel data between old and new datasets, specifically designed for asset management with Asset Name, Host ID, and IPv4 Address columns.

## Features

- **Drag & Drop Interface**: Easy file upload with visual feedback
- **Excel File Support**: Supports .xlsx, .xls, and .csv files
- **Real-time Comparison**: Identifies added, removed, modified, and unchanged records
- **Detailed Analysis**: Tabbed interface showing different types of changes
- **Export Results**: Download comparison results as CSV
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd excel-comparison-tool
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Production Build

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

### Quick Deployment

#### Windows (Batch):
```bash
deploy.bat
```

#### Windows (PowerShell):
```powershell
.\deploy.ps1
```

#### Manual Build:
```bash
npm install
npm run build
```

## How to Use the Application

1. **Upload Old Excel File**: Drag and drop or click to upload your previous Excel file containing Asset Name, Host ID, and IPv4 Addresses columns.

2. **Upload New Excel File**: Upload your current Excel file with the same column structure.

3. **Compare Data**: Click the "Compare Data" button to analyze the differences between the two files.

4. **Review Results**: 
   - View summary statistics in the dashboard cards
   - Navigate through tabs to see detailed breakdowns:
     - **Summary**: Overview of all changes
     - **Added**: New records found in the new file
     - **Removed**: Records that exist in old file but not in new file
     - **Modified**: Records with changed IPv4 addresses
     - **Unchanged**: Records that remain the same

5. **Export Results**: Click "Export Results" to download the comparison data as a CSV file.

## Expected Excel Format

Your Excel files should have the following columns (in any order):
- **Asset Name**: Name or identifier of the asset
- **Host ID**: Host identifier
- **IPv4 Addresses**: IP address of the asset

### Example Excel Structure:
| Asset Name | Host ID | IPv4 Addresses |
|------------|---------|----------------|
| Server-001 | HOST001 | 192.168.1.100  |
| Server-002 | HOST002 | 192.168.1.101  |
| Server-003 | HOST003 | 192.168.1.102  |

## Comparison Logic

The application compares records based on the combination of Asset Name and Host ID:
- **Added**: Records that exist in the new file but not in the old file
- **Removed**: Records that exist in the old file but not in the new file
- **Modified**: Records with the same Asset Name and Host ID but different IPv4 addresses
- **Unchanged**: Records with identical Asset Name, Host ID, and IPv4 address

## Testing

### Sample Data
The application includes sample CSV files for testing:
- `sample-data/old-data.csv` - Sample old dataset
- `sample-data/new-data.csv` - Sample new dataset with changes

### Quick Test
1. Open `test.html` in your browser
2. Download the sample CSV files
3. Upload them to the application
4. Compare the data to see the results

## Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to your hosting provider

### Docker Deployment

Build and run:
```bash
docker build -t excel-comparison-tool .
docker run -p 80:80 excel-comparison-tool
```

### Local File Server

For simple local testing, you can serve the built files:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (install serve globally first)
npx serve dist

# Using PHP
php -S localhost:8000 -t dist
```

Then open `http://localhost:8000` in your browser.

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **XLSX**: Excel file parsing library
- **React Dropzone**: Drag and drop file upload
- **Lucide React**: Beautiful icons

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Port Issues
- If port 3000 is blocked, the app automatically uses port 5173
- You can change the port in `vite.config.js`

### File Upload Issues
- Ensure your Excel file has the required columns (Asset Name, Host ID, IPv4 Addresses)
- Check that the file is not corrupted
- Try converting to .xlsx format if using .xls

### Performance Issues
- For large files (>10,000 records), the comparison may take a few seconds
- Consider splitting very large files into smaller chunks

### Browser Compatibility
- Use a modern browser with ES6+ support
- Enable JavaScript in your browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository or contact the development team. 