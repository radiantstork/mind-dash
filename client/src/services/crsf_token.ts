
export function getCookie(name: string) {
  let value = null;
  if (document.cookie && document.cookie !== '') {
    document.cookie.split(';').forEach(cookie => {
      const [key, val] = cookie.trim().split('=');
      if (key === name) value = decodeURIComponent(val);
    });
  }
  return value;
}