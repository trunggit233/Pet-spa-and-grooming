const TELEGRAM_CONFIG = {
  token: "8652270861:AAF4LjwMdisXpJNspr-yVfufA2z93gm0n0A",
  chatId: "6085897240",
};

const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwUYNetLdKO8c93aYq_T7id7voQGESoBYru282h_FJIwFlf9hN4cb356yzB_--IJDMB-A/exec";

const WEIGHT_LABELS = {
  "under-5kg": "< 5 kg",
  "5-10kg": "5 – 10 kg",
  "10-20kg": "10 – 20 kg",
  "over-20kg": "> 20 kg",
};

const PERSONALITY_LABELS = {
  shy: "Nhút nhát / Sợ người lạ",
  energetic: "Tăng động, thích đùa",
  calm: "Ngoan, hợp tác",
};

const SERVICE_LABELS = {
  hygiene: "Vệ Sinh Tiêu Chuẩn",
  "full-grooming": "Cắt Tỉa Toàn Diện",
  "spa-recovery": "Spa Phục Hồi Lông",
  consult: "Cần tư vấn gói phù hợp",
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
      await Promise.all([sendToTelegram(data), sendToGoogleSheet(data)]);
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
  if (!TELEGRAM_CONFIG.token || !TELEGRAM_CONFIG.chatId) {
    return;
  }

  const petTypeLabel = data.petType === "cat" ? "🐈 Mèo" : "🐕 Chó";

  const message = [
    "🐾 <b>ĐƠN ĐẶT LỊCH CHĂM SÓC MỚI</b> 🐾",
    "━━━━━━━━━━━━━━━━━━━━",
    "👤 <b>Thông tin Sen:</b>",
    `• Họ tên: <b>${escapeHtml(data.ownerName || "Chưa cung cấp")}</b>`,
    `• SĐT: <a href="tel:${escapeHtml(data.ownerPhone || "")}">${escapeHtml(data.ownerPhone || "Chưa cung cấp")}</a>`,
    "",
    "🐶 <b>Hồ sơ Bé cưng:</b>",
    `• Tên bé: <b>${escapeHtml(data.petName || "Chưa đặt tên")}</b> (${petTypeLabel})`,
    `• Giống loài: ${escapeHtml(data.petBreed || "Chưa rõ")}`,
    `• Cân nặng: ${WEIGHT_LABELS[data.petWeight] || escapeHtml(data.petWeight || "Chưa chọn")}`,
    `• Tính cách: <b>${PERSONALITY_LABELS[data.petPersonality] || escapeHtml(data.petPersonality || "Chưa chọn")}</b>`,
    "",
    "✂️ <b>Dịch vụ & Ghi chú:</b>",
    `• Gói chọn: <b>${SERVICE_LABELS[data.servicePackage] || escapeHtml(data.servicePackage || "Chưa chọn")}</b>`,
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Telegram API Error: ${response.status} - ${errorData.description || response.statusText}`,
    );
  }
}

async function sendToGoogleSheet(data) {
  if (!GOOGLE_SHEET_URL) {
    return;
  }

  const payload = {
    submittedAt: new Date().toLocaleString("vi-VN"),
    ownerName: data.ownerName || "",
    ownerPhone: data.ownerPhone || "",
    petName: data.petName || "",
    petType: data.petType === "cat" ? "Mèo" : "Chó",
    petBreed: data.petBreed || "",
    petWeight: WEIGHT_LABELS[data.petWeight] || data.petWeight || "",
    petPersonality:
      PERSONALITY_LABELS[data.petPersonality] || data.petPersonality || "",
    servicePackage:
      SERVICE_LABELS[data.servicePackage] || data.servicePackage || "",
    bookingNote: data.bookingNote || "",
  };

  await fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
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
