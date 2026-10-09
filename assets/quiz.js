document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.quiz-card');

  cards.forEach(card => {
    const options = card.querySelectorAll('.quiz-option');
    const feedback = card.querySelector('.quiz-feedback');

    options.forEach(option => {
      option.addEventListener('click', () => {
        // Disable further clicks once answered
        if (card.dataset.answered === 'true') return;
        card.dataset.answered = 'true';

        const isCorrect = option.dataset.correct === 'true';
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        if (isCorrect) {
          option.classList.add('correct');
          if (feedback) {
            feedback.classList.add('show', 'success');
            feedback.innerHTML = `<strong>Chính xác!</strong> ${option.dataset.explanation || ''}`;
          }
        } else {
          option.classList.add('incorrect');
          // Highlight the correct one
          options.forEach(opt => {
            if (opt.dataset.correct === 'true') {
              opt.classList.add('correct');
            }
          });
          if (feedback) {
            feedback.classList.add('show', 'error');
            feedback.innerHTML = `<strong>Chưa chính xác.</strong> ${option.dataset.explanation || ''}`;
          }
        }
      });
    });
  });
});
