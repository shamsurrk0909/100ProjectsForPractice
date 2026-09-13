# Form Validation

A real-time signup form validation using JavaScript and regex.

## 📋 Description

This project validates signup form inputs with real-time feedback using regex and DOM events. It includes password strength indicator, show/hide password toggle, and accessible error messages.

## ✨ Features

- Real-time validation as you type
- Email format validation
- Password policy (8+ chars, uppercase, lowercase, number, special)
- Password strength bar (red/yellow/green)
- Confirm password matching
- Optional phone number validation
- Terms checkbox requirement
- Show/hide password toggle
- Reset button
- Accessible error messages with ARIA

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript

## 📁 Project Structure

```
Form Validation/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 🚀 How to Use

1. Open `index.html` in your browser
2. Fill in the signup form
3. See real-time validation feedback
4. Click **Sign up** to validate and submit

## 📝 Validation Rules

| Field | Rule |
|-------|------|
| Name | Required |
| Email | Required, valid format |
| Password | Min 8 chars, uppercase, lowercase, number, special |
| Confirm Password | Must match password |
| Phone | Optional, valid Indian number |
| Terms | Must be checked |

## 💡 Future Improvements

- Username availability check
- Captcha verification
- Save form data in localStorage
- Dark/light mode toggle

## 📄 License

Open-source for personal and educational use.

---

*Made with ❤️ and JavaScript*

