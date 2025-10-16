// Quick configuration for PK CLEAR site integration
window.PKC_CONFIG = {
  server: {
    season: "S15",
    exp: "xXXX",
    drop: "xXX%"
  },
  links: {
    downloadClient: "#",
    downloadLauncher: "#"
  },
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
    // Slugs for categories used throughout the news widgets
    categories: {
      featured: "noi-bat",
      su_kien: "su-kien",
      pk_clear: "muonline-pkclear",
      tin_tuc: "tin-tuc-cap-nhat",
      cap_nhat: "cap-nhat",
      huong_dan: "huong-dan",
      co_ban: "co-ban",
      meo_nang_cao: "meo-nang-cao",
      trang_bi: "trang-bi"
    }
  }
};
