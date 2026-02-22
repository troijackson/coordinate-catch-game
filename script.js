// ===== COORDINATE CATCH! - GAME LOGIC =====
// OAS 6.N.1.1 - Coordinate Plane Game

(function() {
    'use strict';

    // Language state
    let isSpanish = false;

    // Game state
    let currentQuestion = 0;
    let score = 0;
    let totalQuestions = 10;
    let questions = [];
    let answered = false;

    // DOM Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const langToggle = document.getElementById('lang-toggle');
    const scoreDisplay = document.getElementById('score');
    const questionNumDisplay = document.getElementById('question-num');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers-container');
    const feedbackBox = document.getElementById('feedback-box');
    const feedbackText = document.getElementById('feedback-text');
    const pointMarker = document.getElementById('point-marker');
    const finalScoreDisplay = document.getElementById('final-score');
    const endMessage = document.getElementById('end-message');
    const confettiContainer = document.getElementById('confetti');
    const coordPlane = document.getElementById('coord-plane');

    // Question templates (OSTP style)
    const questionTemplates = {
        en: [
            {
                type: 'identify',
                text: 'What are the coordinates of the star?',
                explanation: 'The x-coordinate tells how far left or right. The y-coordinate tells how far up or down.'
            },
            {
                type: 'quadrant',
                text: 'In which quadrant is the point located?',
                explanation: 'Quadrant I: (+,+), Quadrant II: (−,+), Quadrant III: (−,−), Quadrant IV: (+,−)'
            },
            {
                type: 'axis',
                text: 'The point is on which axis?',
                explanation: 'Points on the x-axis have y = 0. Points on the y-axis have x = 0.'
            },
            {
                type: 'xcoord',
                text: 'What is the x-coordinate of the star?',
                explanation: 'The x-coordinate is how far left (negative) or right (positive) from the origin.'
            },
            {
                type: 'ycoord',
                text: 'What is the y-coordinate of the star?',
                explanation: 'The y-coordinate is how far down (negative) or up (positive) from the origin.'
            }
        ],
        es: [
            {
                type: 'identify',
                text: '¿Cuáles son las coordenadas de la estrella?',
                explanation: 'La coordenada x dice qué tan lejos a la izquierda o derecha. La coordenada y dice qué tan arriba o abajo.'
            },
            {
                type: 'quadrant',
                text: '¿En qué cuadrante está ubicado el punto?',
                explanation: 'Cuadrante I: (+,+), Cuadrante II: (−,+), Cuadrante III: (−,−), Cuadrante IV: (+,−)'
            },
            {
                type: 'axis',
                text: '¿El punto está en cuál eje?',
                explanation: 'Los puntos en el eje x tienen y = 0. Los puntos en el eje y tienen x = 0.'
            },
            {
                type: 'xcoord',
                text: '¿Cuál es la coordenada x de la estrella?',
                explanation: 'La coordenada x es qué tan lejos a la izquierda (negativo) o derecha (positivo) desde el origen.'
            },
            {
                type: 'ycoord',
                text: '¿Cuál es la coordenada y de la estrella?',
                explanation: 'La coordenada y es qué tan abajo (negativo) o arriba (positivo) desde el origen.'
            }
        ]
    };

    // Initialize grid
    function initGrid() {
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = '';
        
        const gridSize = coordPlane.offsetWidth <= 260 ? 200 : 240;
        const step = gridSize / 10;
        
        // Create grid lines
        for (let i = 0; i <= 10; i++) {
            // Horizontal lines
            const hLine = document.createElement('div');
            hLine.className = 'grid-line horizontal';
            hLine.style.top = (i * step) + 'px';
            gridContainer.appendChild(hLine);
            
            // Vertical lines
            const vLine = document.createElement('div');
            vLine.className = 'grid-line vertical';
            vLine.style.left = (i * step) + 'px';
            gridContainer.appendChild(vLine);
        }
        
        // Add labels
        const labels = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
        labels.forEach((num, i) => {
            if (num !== 0) {
                // X-axis labels
                const xLabel = document.createElement('div');
                xLabel.className = 'grid-label';
                xLabel.textContent = num;
                xLabel.style.left = (30 + i * step - 5) + 'px';
                xLabel.style.top = (coordPlane.offsetWidth <= 260 ? 130 : 155) + 'px';
                coordPlane.appendChild(xLabel);
                
                // Y-axis labels
                const yLabel = document.createElement('div');
                yLabel.className = 'grid-label';
                yLabel.textContent = -num;
                yLabel.style.left = (coordPlane.offsetWidth <= 260 ? 130 : 155) + 'px';
                yLabel.style.top = (25 + i * step - 8) + 'px';
                coordPlane.appendChild(yLabel);
            }
        });
    }

    // Generate a random question
    function generateQuestion() {
        const templates = isSpanish ? questionTemplates.es : questionTemplates.en;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        let x, y;
        let correctAnswer, wrongAnswers;
        
        // Generate point based on question type
        if (template.type === 'axis') {
            // Point on an axis
            if (Math.random() < 0.5) {
                x = 0;
                y = Math.floor(Math.random() * 9) - 4;
                if (y === 0) y = 1;
                correctAnswer = isSpanish ? 'Eje Y' : 'Y-axis';
                wrongAnswers = isSpanish 
                    ? ['Eje X', 'Cuadrante I', 'Cuadrante III']
                    : ['X-axis', 'Quadrant I', 'Quadrant III'];
            } else {
                x = Math.floor(Math.random() * 9) - 4;
                if (x === 0) x = 1;
                y = 0;
                correctAnswer = isSpanish ? 'Eje X' : 'X-axis';
                wrongAnswers = isSpanish 
                    ? ['Eje Y', 'Cuadrante II', 'Cuadrante IV']
                    : ['Y-axis', 'Quadrant II', 'Quadrant IV'];
            }
        } else {
            // Point not on axis
            x = Math.floor(Math.random() * 9) - 4;
            y = Math.floor(Math.random() * 9) - 4;
            if (x === 0) x = Math.random() < 0.5 ? -1 : 1;
            if (y === 0) y = Math.random() < 0.5 ? -1 : 1;
        }
        
        // Generate answers based on type
        if (template.type === 'identify') {
            correctAnswer = `(${x}, ${y})`;
            wrongAnswers = [
                `(${y}, ${x})`,
                `(${-x}, ${y})`,
                `(${x}, ${-y})`
            ];
        } else if (template.type === 'quadrant') {
            if (x > 0 && y > 0) {
                correctAnswer = isSpanish ? 'Cuadrante I' : 'Quadrant I';
            } else if (x < 0 && y > 0) {
                correctAnswer = isSpanish ? 'Cuadrante II' : 'Quadrant II';
            } else if (x < 0 && y < 0) {
                correctAnswer = isSpanish ? 'Cuadrante III' : 'Quadrant III';
            } else {
                correctAnswer = isSpanish ? 'Cuadrante IV' : 'Quadrant IV';
            }
            wrongAnswers = isSpanish 
                ? ['Cuadrante I', 'Cuadrante II', 'Cuadrante III', 'Cuadrante IV'].filter(q => q !== correctAnswer)
                : ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'].filter(q => q !== correctAnswer);
        } else if (template.type === 'xcoord') {
            correctAnswer = String(x);
            wrongAnswers = [String(y), String(-x), String(x + (Math.random() < 0.5 ? 1 : -1))];
        } else if (template.type === 'ycoord') {
            correctAnswer = String(y);
            wrongAnswers = [String(x), String(-y), String(y + (Math.random() < 0.5 ? 1 : -1))];
        }
        
        // Shuffle answers
        const allAnswers = [correctAnswer, ...wrongAnswers.slice(0, 3)];
        shuffleArray(allAnswers);
        
        return {
            x: x,
            y: y,
            text: template.text,
            explanation: template.explanation,
            correctAnswer: correctAnswer,
            answers: allAnswers
        };
    }

    // Shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Position point marker
    function positionPoint(x, y) {
        const planeWidth = coordPlane.offsetWidth;
        const planeHeight = coordPlane.offsetHeight;
        const centerX = planeWidth / 2;
        const centerY = planeHeight / 2;
        const step = (planeWidth - 60) / 10;
        
        const pixelX = centerX + (x * step);
        const pixelY = centerY - (y * step);
        
        pointMarker.style.left = pixelX + 'px';
        pointMarker.style.top = pixelY + 'px';
    }

    // Display current question
    function displayQuestion() {
        if (currentQuestion >= totalQuestions) {
            endGame();
            return;
        }
        
        answered = false;
        const q = questions[currentQuestion];
        
        positionPoint(q.x, q.y);
        questionText.textContent = q.text;
        questionNumDisplay.textContent = `${currentQuestion + 1}/${totalQuestions}`;
        
        answersContainer.innerHTML = '';
        q.answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => checkAnswer(answer, btn));
            answersContainer.appendChild(btn);
        });
        
        feedbackBox.classList.add('hidden');
        feedbackBox.classList.remove('correct', 'incorrect');
    }

    // Check answer
    function checkAnswer(selected, btn) {
        if (answered) return;
        answered = true;
        
        const q = questions[currentQuestion];
        const isCorrect = selected === q.correctAnswer;
        
        // Disable all buttons
        const allBtns = answersContainer.querySelectorAll('.answer-btn');
        allBtns.forEach(b => {
            b.style.pointerEvents = 'none';
            if (b.textContent === q.correctAnswer) {
                b.classList.add('correct');
            }
        });
        
        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
            btn.classList.add('correct');
            feedbackBox.className = 'feedback-box correct';
            feedbackText.textContent = (isSpanish ? '✅ ¡Correcto! ' : '✅ Correct! ') + q.explanation;
        } else {
            btn.classList.add('incorrect');
            feedbackBox.className = 'feedback-box incorrect';
            feedbackText.textContent = (isSpanish ? '❌ No exactamente. ' : '❌ Not quite. ') + q.explanation;
        }
        
        // Next question after delay
        setTimeout(() => {
            currentQuestion++;
            displayQuestion();
        }, 2500);
    }

    // Generate all questions
    function generateQuestions() {
        questions = [];
        for (let i = 0; i < totalQuestions; i++) {
            questions.push(generateQuestion());
        }
    }

    // Start game
    function startGame() {
        currentQuestion = 0;
        score = 0;
        scoreDisplay.textContent = '0';
        
        generateQuestions();
        initGrid();
        
        startScreen.classList.remove('active');
        endScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        displayQuestion();
    }

    // End game
    function endGame() {
        gameScreen.classList.remove('active');
        endScreen.classList.add('active');
        
        finalScoreDisplay.textContent = score;
        
        let message;
        if (score === 10) {
            message = isSpanish ? '🌟 ¡PERFECTO! ¡Eres un maestro de coordenadas!' : '🌟 PERFECT! You are a coordinate master!';
        } else if (score >= 8) {
            message = isSpanish ? '🎯 ¡Excelente trabajo! ¡Casi perfecto!' : '🎯 Excellent work! Almost perfect!';
        } else if (score >= 6) {
            message = isSpanish ? '👍 ¡Buen trabajo! ¡Sigue practicando!' : '👍 Good job! Keep practicing!';
        } else {
            message = isSpanish ? '💪 ¡Sigue intentando! ¡Tú puedes!' : '💪 Keep trying! You can do it!';
        }
        endMessage.textContent = message;
        
        // Confetti!
        if (score >= 6) {
            createConfetti();
        }
    }

    // Create confetti
    function createConfetti() {
        confettiContainer.innerHTML = '';
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#26de81'];
        
        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (2 + Math.random() * 2) + 's';
            confettiContainer.appendChild(piece);
        }
    }

    // Toggle language
    function toggleLanguage() {
        isSpanish = !isSpanish;
        
        document.querySelectorAll('.lang-en').forEach(el => {
            el.style.display = isSpanish ? 'none' : '';
        });
        document.querySelectorAll('.lang-es').forEach(el => {
            el.style.display = isSpanish ? '' : 'none';
        });
        
        langToggle.textContent = isSpanish ? '🌐 English' : '🌐 Español';
        
        // Regenerate questions if in game
        if (gameScreen.classList.contains('active')) {
            generateQuestions();
            displayQuestion();
        }
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    langToggle.addEventListener('click', toggleLanguage);

    // Initialize grid on load
    window.addEventListener('load', initGrid);
    window.addEventListener('resize', initGrid);

})();