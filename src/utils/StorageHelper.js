export const getDataWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
  
    try {
      const item = JSON.parse(itemStr);
  
      if (item.expiry) {
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return item.value;
      }
  
      return itemStr;
    } catch (error) {
      return itemStr;
    }
  };
  