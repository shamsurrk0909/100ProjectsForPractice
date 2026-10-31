# QR Code Generator

A QR code generator that creates downloadable QR codes from any text or URL.

## 📋 Description

This project is a QR code generator built with HTML, CSS, and JavaScript. It uses the QRServer API to generate QR codes from text or URLs. Users can customize size, margin, and error correction level, then preview, download, or open the QR code in a new tab.

## ✨ Features and chrateristics

- **Generate QR Codes**: Convert any text or URL into a QR code
- **Customizable Size**: Set size from 100px to 2000px
- **Adjustable Margin**: Set margin from 0 to 10
- **Error Correction Levels**: Choose from L, M, Q, or H
- **Live Preview**: Displays the generated QR code instantly
- **Download PNG**: Save the QR code as a PNG image
- **Open in New Tab**: View the full-size QR code
- **Keyboard Shortcut**: Ctrl+Enter to generate
- **Status Messages**: Shows progress and errors
- **Responsive Design**: Works on all screen sizes

## 🛠️ Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling
- **JavaScript**: API integration and DOM manipulation
- **QRServer API**: QR code generation

## 📁 Project Structure

```
QR Code Generator/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── script.js       # JavaScript logic
└── README.md       # Project documentation
```

## 🚀 How to Use the app

1. Clone or download the repository
2. Open `index.html` in your web browser
3. Enter text or URL in the textarea
4. Adjust size, margin, and error correction
5. Click **Generate QR**
6. Preview the QR code
7. Click **Download PNG** or **Open in new tab**

## 🎨 Features in Detail

### Input Options
- **Text or URL**: Any string to encode
- **Size**: Width and height in pixels (100–2000)
- **Margin**: White space around the QR code (0–10)
- **Error Correction**:
  - L (7%): Low
  - M (15%): Medium (default)
  - Q (25%): Quartile
  - H (30%): High

### Actions
- **Generate QR**: Creates the QR code
- **Open in new tab**: Opens full image
- **Download PNG**: Saves as image file

### Keyboard Shortcut
- **Ctrl + Enter** (or **Cmd + Enter** on Mac): Generate QR

## 📝 Code Explanation

### HTML
- Text area for input
- Number inputs for size and margin
- Select for error correction
- Buttons for generate, open, and download
- Preview container

### CSS
- Dark theme with gradient accents
- Responsive layout
- Clean preview box
- Disabled button styling

### JavaScript
- `buildQrUrl()`: Constructs QRServer API URL
- `generateQr()`: Fetches QR image as blob
- `downloadCurrentImage()`: Downloads as PNG
- `openInNewTab()`: Opens image in new tab
- `revokeCurrentUrl()`: Cleans up object URLs
- Event listeners for all buttons and keyboard

## 🔧 API Configuration

```
https://api.qrserver.com/v1/create-qr-code/
```

No API key required.

## 💡 Future Improvements

- Add color customization
- Add logo overlay
- Save QR history
- Generate multiple QR codes at once
- Support for vCard, WiFi, and email formats
- Dark/light QR toggle

## ⚠️ Browser Support

- Works on all modern browsers
- Requires internet connection
- No API key needed

## 📄 License

Open-source for personal and educational use.

## 👨‍💻 Author

Developed as a learning project to practice JavaScript and API integration.

---

*Made with ❤️ and JavaScript*

