const path = require("path");

module.exports = {
  // ... các config khác
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 👈 Thêm extensions nếu cần
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 Không có dấu / cuối
      // Hoặc nếu vẫn lỗi thử:
    },
  },
};
