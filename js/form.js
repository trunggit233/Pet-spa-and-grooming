/* ==========================================================================
   Form — Validation & Submission
   ========================================================================== */

export function initForm() {
  const bookingForm = document.querySelector('.booking-form');

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    // Collect form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    // TODO: Gửi data tới backend/API
    console.log('Booking submitted:', data);

    // Show success message (placeholder)
    showSuccessMessage(bookingForm);
  });
}

function showSuccessMessage(form) {
  const successEl = document.createElement('div');
  successEl.className = 'form-success';
  successEl.setAttribute('role', 'alert');
  successEl.innerHTML = `
    <p>✅ Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.</p>
  `;

  form.replaceWith(successEl);
}

