export function initForm() {
  const bookingForm = document.querySelector('.booking-form');

  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    console.log('Booking submitted:', data);
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
