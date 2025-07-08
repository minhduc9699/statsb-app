// api/uploadcareAPI.js
const UPLOADCARE_PUBLIC_KEY = "dbddae4f64d1ab0ca344";
const UPLOADCARE_SECRET_KEY = "YOUR_SECRET_KEY"; // để bảo mật, nên gọi từ backend nếu dùng secret

const API_BASE = "https://api.uploadcare.com";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${UPLOADCARE_SECRET_KEY}`,
};

/**
 * Lấy thông tin file theo UUID
 */
export const getFileInfo = async (uuid) => {
  const res = await fetch(`${API_BASE}/files/${uuid}/`, {
    method: "GET",
    headers,
  });
  if (!res.ok) throw new Error("Lỗi khi lấy thông tin file");
  return await res.json();
};

/**
 * Xoá file khỏi Uploadcare (bắt buộc cần SECRET_KEY)
 */
export const deleteFile = async (uuid) => {
  const res = await fetch(`${API_BASE}/files/${uuid}//`, {
    method: "DELETE",
    headers,
  });
  if (res.status !== 204) throw new Error("Không xoá được file");
};

/**
 * Store file (xác nhận lưu file vĩnh viễn, dùng cho file uploaded tạm)
 */
export const storeFile = async (uuid) => {
  const res = await fetch(`${API_BASE}/files/${uuid}/storage/`, {
    method: "PUT",
    headers,
  });
  if (!res.ok) throw new Error("Không thể lưu trữ file");
  return await res.json();
};

/**
 * Unstore file (xoá khỏi trạng thái lưu trữ - file sẽ bị xoá sau 24h)
 */
export const unstoreFile = async (uuid) => {
  const res = await fetch(`${API_BASE}/files/${uuid}/storage/`, {
    method: "DELETE",
    headers,
  });
  if (res.status !== 204) throw new Error("Không thể unstore file");
};
