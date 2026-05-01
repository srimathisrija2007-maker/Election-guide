document.addEventListener('DOMContentLoaded', () => {
    
    // --- Smooth Scrolling for Navbar Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;
            
            // Close all other accordions (optional, but good UX here)
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current accordion
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Quiz Logic ---
    let currentQuestion = 1;
    const totalQuestions = 2;
    
    const optionBtns = document.querySelectorAll('.option-btn');
    const nextBtn = document.getElementById('next-q-btn');
    const feedbackEl = document.getElementById('quiz-feedback');
    const restartBtn = document.getElementById('restart-quiz');

    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Prevent multiple clicks
            const parent = this.closest('.options');
            if(parent.classList.contains('answered')) return;
            parent.classList.add('answered');

            const isCorrect = this.getAttribute('data-correct') === 'true';
            
            // Highlight options
            const allOptions = parent.querySelectorAll('.option-btn');
            allOptions.forEach(opt => {
                opt.disabled = true;
                if(opt.getAttribute('data-correct') === 'true') {
                    opt.classList.add('correct');
                } else if(opt === this && !isCorrect) {
                    opt.classList.add('wrong');
                }
            });

            // Show feedback
            if(isCorrect) {
                feedbackEl.innerHTML = '<span style="color: var(--success);">Correct! Great job.</span>';
            } else {
                feedbackEl.innerHTML = '<span style="color: var(--error);">Oops! That\'s incorrect.</span>';
            }

            // Show next button or finish
            if(currentQuestion < totalQuestions) {
                nextBtn.style.display = 'inline-block';
            } else {
                setTimeout(() => {
                    document.getElementById(`q${currentQuestion}`).classList.remove('active');
                    document.getElementById('quiz-feedback').style.display = 'none';
                    document.getElementById('quiz-result').style.display = 'block';
                }, 1500);
            }
        });
    });

    nextBtn.addEventListener('click', () => {
        document.getElementById(`q${currentQuestion}`).classList.remove('active');
        currentQuestion++;
        document.getElementById(`q${currentQuestion}`).classList.add('active');
        
        nextBtn.style.display = 'none';
        feedbackEl.innerHTML = '';
    });

    restartBtn.addEventListener('click', () => {
        currentQuestion = 1;
        document.getElementById('quiz-result').style.display = 'none';
        document.getElementById('quiz-feedback').style.display = 'block';
        feedbackEl.innerHTML = '';
        
        // Reset all questions
        for(let i=1; i<=totalQuestions; i++) {
            const q = document.getElementById(`q${i}`);
            q.style.display = ''; // Remove inline display none if any
            if(i === 1) q.classList.add('active');
            else q.classList.remove('active');
            
            const options = q.querySelector('.options');
            options.classList.remove('answered');
            options.querySelectorAll('.option-btn').forEach(opt => {
                opt.disabled = false;
                opt.classList.remove('correct', 'wrong');
            });
        }
    });

});
