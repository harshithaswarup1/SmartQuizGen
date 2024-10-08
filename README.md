# Smart Quiz Generation App

## Overview
The Smart Quiz Generation App is designed to help students efficiently prepare for exams through interactive quizzes and flashcards. Built with Python 3.11, Ionic 5, and OpenAI's GPT-3.5 Turbo, this app offers an engaging and effective learning experience.

## Technologies Used
**Backend:** Python 3.11
**Frontend:** Ionic 5
**AI Integration:** OpenAI GPT-3.5 Turbo

## Features
### Quiz Mode
1. Upon logging in, Students can select a subject to initiate a quiz.
2. Each quiz comprises 20 MCQs pertinent to the chosen subject. Students are required to answer all questions, as skipping is not permitted.
3. After submitting responses, the app calculates the total score and presents a detailed scorecard for each subject.
4. Students have the opportunity to retake a quiz on a different subject, allowing for continued practice and learning.


### Flashcards
1. Similar to the quiz mode, Students can select a subject to access flashcards for review.
2. Interactive Flashcards: Each flashcard displays a term or concept with a "Show Description" button. Clicking this button reveals a comprehensive description of the term.
3. Students can mark each flashcard as either "I Know" or "I Am Learning".
4. "I Know": Marks the card as mastered, removes it from the list, and increments the count of mastered words.
5. "I Am Learning": Retains the card in the list for ongoing review and practice.
6. A summary of the number of words mastered for each subject is also shown.

