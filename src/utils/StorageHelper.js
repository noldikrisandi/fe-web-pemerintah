export const getDataWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
  
    try {
      // Coba parsing JSON
      const item = JSON.parse(itemStr);
  
      // Jika item punya expiry, cek apakah masih berlaku
      if (item.expiry) {
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      }
  
      // Jika tidak ada expiry, mungkin itu JWT biasa, kembalikan stringnya saja
      return itemStr;
    } catch (error) {
      // Jika gagal parsing, anggap itu JWT string dan langsung return
      return itemStr;
    }
  };
  