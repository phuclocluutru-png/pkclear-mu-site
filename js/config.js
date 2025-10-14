// Cấu hình nhanh cho PK CLEAR
window.PKC_CONFIG = {
  server: { season: "S15", exp: "xXXX", drop: "xXX%" },
  links: { downloadClient: "#", downloadLauncher: "#" },
  contact: {
    facebook: { href: "https://facebook.com/yourpage", label: "facebook.com/yourpage" },
    zalo: { href: "https://zalo.me/yourid", label: "zalo.me/yourid" },
    discord: { href: "https://discord.gg/yourinvite", label: "discord.gg/yourinvite" },
    email: { href: "mailto:admin@pkclear.vn", label: "admin@pkclear.vn" },
    phone: { href: "tel:0123456789", label: "0123 456 789" }
  },
  wordpress: {
    baseUrl: "https://pkclear.com",
    useProxy: false,
    // Slug các danh mục để phân tab/featured
    categories: {
      featured: "noi-bat",
      su_kien: "su-kien",
      cap_nhat: "cap-nhat",
      huong_dan: "huong-dan"
    }
  }
};
