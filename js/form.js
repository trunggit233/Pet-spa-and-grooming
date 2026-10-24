const TELEGRAM_CONFIG = {
  token: "8652270861:AAF4LjwMdisXpJNspr-yVfufA2z93gm0n0A",
  chatId: "6085897240",
};

export function initForm() {
  const bookingForm = document.querySelector(".booking-form");

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }

    const submitBtn = bookingForm.querySelector(".booking-submit-btn");
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Đang gửi thông tin...";
    }

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    try {
      await sendToTelegram(data);
      showSuccessMessage(bookingForm);
    } catch (error) {
      console.error(error);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
      alert(
        "Có lỗi xảy ra khi gửi thông tin. Vui lòng liên hệ trực tiếp qua hotline!",
      );
    }
  });
}

async function sendToTelegram(data) {
  if (
    TELEGRAM_CONFIG.token ===
      "8652270861:AAF4LjwMdisXpJNspr-yVfufA2z93gm0n0A" ||
    TELEGRAM_CONFIG.chatId === "6085897240"
  ) {
    return;
  }

  const petTypeLabel = data.petType === "cat" ? "🐈 Mèo" : "🐕 Chó";

  const weightLabels = {
    "under-5kg": "< 5 kg",
    "5-10kg": "5 – 10 kg",
    "10-20kg": "10 – 20 kg",
    "over-20kg": "> 20 kg",
  };

  const personalityLabels = {
    shy: "Nhút nhát / Sợ người lạ",
    energetic: "Tăng động, thích đùa",
    calm: "Ngoan, hợp tác",
  };

  const serviceLabels = {
    hygiene: "Vệ Sinh Tiêu Chuẩn",
    "full-grooming": "Cắt Tỉa Toàn Diện",
    "spa-recovery": "Spa Phục Hồi Lông",
    consult: "Cần tư vấn gói phù hợp",
  };

  const message = [
    "🐾 <b>ĐƠN ĐẶT LỊCH CHĂM SÓC MỚI</b> 🐾",
    "━━━━━━━━━━━━━━━━━━━━",
    "👤 <b>Thông tin Sen:</b>",
    `• Họ tên: <b>${escapeHtml(data.ownerName || "Chưa cung cấp")}</b>`,
    `• SĐT: <a href="tel:${data.ownerPhone}">${data.ownerPhone}</a>`,
    "",
    "🐶 <b>Hồ sơ Bé cưng:</b>",
    `• Tên bé: <b>${escapeHtml(data.petName || "Chưa đặt tên")}</b> (${petTypeLabel})`,
    `• Giống loài: ${escapeHtml(data.petBreed || "Chưa rõ")}`,
    `• Cân nặng: ${weightLabels[data.petWeight] || data.petWeight}`,
    `• Tính cách: <b>${personalityLabels[data.petPersonality] || data.petPersonality}</b>`,
    "",
    "✂️ <b>Dịch vụ & Ghi chú:</b>",
    `• Gói chọn: <b>${serviceLabels[data.servicePackage] || data.servicePackage}</b>`,
    `• Ghi chú: <i>${escapeHtml(data.bookingNote || "Không có")}</i>`,
    "━━━━━━━━━━━━━━━━━━━━",
    `⏰ <i>Thời gian gửi: ${new Date().toLocaleString("vi-VN")}</i>`,
  ].join("\n");

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.chatId,
      text: message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API Error: ${response.statusText}`);
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function showSuccessMessage(form) {
  const successEl = document.createElement("div");
  successEl.className = "form-success";
  successEl.setAttribute("role", "alert");
  successEl.innerHTML = `
    <p>✅ Đặt lịch thành công! Tiệm sẽ liên hệ Sen sớm nhất nhé 🐾</p>
  `;

  form.replaceWith(successEl);
}
