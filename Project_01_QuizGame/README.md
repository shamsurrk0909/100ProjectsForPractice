# 🎯 Quiz Game

> A simple, interactive quiz game built with HTML, CSS, and JavaScript — Project 01 of my 100 Projects Learning Journey.

---

## 📖 About The Project

This is a **Quiz Game** that tests your knowledge with 5 fun questions. It features a clean interface, instant feedback on answers, score tracking, and a progress bar. Built as my first project in the 100 Projects Learning Journey.

### 🎯 Purpose of the project

- Practice DOM manipulation with JavaScript
- Build a complete interactive web application
- Learn event handling and state management
- Create a responsive, user-friendly interface

## ✨ Features

- ✅ **5 Quiz Questions** - General knowledge topics
- ✅ **Multiple Choice** - 4 options per question
- ✅ **Instant Feedback** - Green for correct, red for incorrect answers
- ✅ **Score Tracking** - See your score update in real-time
- ✅ **Progress Bar** - Visual indicator of quiz progress
- ✅ **Results Screen** - Final score with personalized message
- ✅ **Restart Option** - Play again anytime
- ✅ **Responsive Design** - Works on all devices

---

## 🛠️ Technologies Used

| Technology            | Purpose                                      |
| --------------------- | -------------------------------------------- |
| **HTML5**             | Semantic structure                           |
| **CSS3**              | Styling, layout, responsive design           |
| **JavaScript (ES6+)** | Quiz logic, DOM manipulation, event handling |

---

## 📂 Project Structure folder

```

Project-01_QuizGame/
│
├── index.html # Main HTML file
├── style.css # All styling
├── script.js # Quiz logic
└── README.md # Documentation

```

---

## 🚀 How to Run the app

### Option 1: Run Locally in your computer

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Learning-Journey-100-Projects-using-HTML-CSS-JS.git
   ```

````

2. **Navigate to the project**

   ```bash
   cd Learning-Journey-100-Projects-using-HTML-CSS-JS/Project-01_QuizGame
   ```

3. **Open in browser**
   - Double-click `index.html`
   - OR use Live Server in VS Code
   - OR right-click → Open with browser

### Option 2: Play Online

[🔗 Click here to play](https://your-username.github.io/Learning-Journey-100-Projects-using-HTML-CSS-JS/Project-01_QuizGame/)

---

## 🎮 How to Play

1. Click **"Start Quiz"** on the welcome screen
2. Read the question and select an answer
3. See instant feedback:
   - ✅ **Green** = Correct answer
   - ❌ **Red** = Wrong answer
4. Your **score updates** automatically
5. Watch the **progress bar** fill up
6. At the end, view your **final score** with a personalized message
7. Click **"Restart Quiz"** to play again

---

## 📸 Screenshots

### Start Screen

![Start Screen](./assets/screenshots/start-screen.png)

### Quiz Screen

![Quiz Screen](./assets/screenshots/quiz-screen.png)

### Results Screen

![Results Screen](./assets/screenshots/result-screen.png)

---

## 📝 Quiz Questions

The quiz includes these 5 questions:

| #   | Question                                      | Category    |
| --- | --------------------------------------------- | ----------- |
| 1   | What is the capital of France?                | Geography   |
| 2   | Which planet is known as the Red Planet?      | Science     |
| 3   | What is the largest ocean on Earth?           | Geography   |
| 4   | Which of these is NOT a programming language? | Programming |
| 5   | What is the chemical symbol for gold?         | Science     |

---

## 🔧 Code Overview

### JavaScript Logic

```javascript
// Quiz data stored as an array of objects
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Paris", correct: true },
      // ...
    ],
  },
];

// State management
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// Main functions
startQuiz(); // Initializes the quiz
showQuestion(); // Displays current question
selectAnswer(); // Handles answer selection
showResults(); // Shows final score
```

### CSS Features

- Flexbox for layout
- CSS transitions for smooth interactions
- Mobile-first responsive design
- Color-coded feedback (green/red)

---

## 📊 What I Learned

Building this project taught me:

- ✅ JavaScript DOM manipulation (`getElementById`, `createElement`, `appendChild`)
- ✅ Event handling (click events)
- ✅ State management (tracking question index, score)
- ✅ Array methods (forEach, dataset properties)
- ✅ CSS styling and transitions
- ✅ Responsive design with media queries
- ✅ Using `setTimeout` for delayed actions
- ✅ Data attributes (`dataset.correct`)

---

## 🔮 Future Improvements

Here are some features I plan to add in future projects:

- [ ] Timer for each question
- [ ] More questions and categories
- [ ] High score tracking with localStorage
- [ ] Sound effects
- [ ] Difficulty levels
- [ ] Share results on social media

---

## 🤝 Contributing

This is a personal learning project, but suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the **MIT License**.

---

## 🙏 Acknowledgments

- Part of the **100 Projects Learning Journey**
- Inspired by various online tutorials and resources
- Thanks to the developer community for continuous learning

---

## 📬 Connect With Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](your-linkedin-url)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](your-twitter-url)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](your-portfolio-url)

---

## ⭐ Show Your Support

If you found this helpful:

- ⭐ Star the repository
- 🍴 Fork it for your own learning
- 📢 Share it with fellow learners

---

**Made with ❤️ as part of the 100 Projects Learning Journey**

[⬆ Back to Top](#-quiz-game)

````

---

# Quiz Game

A simple interactive quiz game built with HTML, CSS, and JavaScript.

## 🚀 Features

- 5 multiple-choice questions
- Instant feedback (correct/incorrect)
- Score tracking
- Progress bar
- Restart option
- Responsive design

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)

## 📂 Files

- `index.html` - Structure
- `style.css` - Styling
- `script.js` - Quiz logic

## 🎮 How to Play

1. Click "Start Quiz"
2. Select an answer
3. See instant feedback
4. View your final score

## 📸 Screenshots

_(Add screenshots here)_

## 📝 Questions Included

1. Capital of France → Paris
2. Red Planet → Mars
3. Largest ocean → Pacific Ocean
4. NOT a programming language → Banana
5. Chemical symbol for gold → Au

## 🚀 Run Locally

```bash
git clone <repo-url>
cd Project-01_QuizGame
open index.html
```
````

## 📬 Contact

Email - shamsurrk0609@gmail.com

---

Project 01 of #100ProjectsLearningJourney

````

---

## 📝 **Instructions to Add README**

### Option 1: Create on GitHub
1. Go to your repository
2. Click **"Add file"** → **"Create new file"**
3. Name it `README.md`
4. Paste the content above
5. Click **"Commit new file"**

### Option 2: Create Locally
1. Open VS Code in your `Project-01_QuizGame` folder
2. Create new file: `README.md`
3. Paste the content
4. Save
5. Push to GitHub:
   ```bash
   git add README.md
   git commit -m "📝 Add README for Quiz Game"
   git push origin main
````

---


