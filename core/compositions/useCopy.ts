function fallback (text: string) {
  const area = document.createElement('textarea');

  area.value = text;
  area.contentEditable = 'true';
  area.style.position = 'fixed'; // avoid scrolling to bottom

  document.body.appendChild(area);
  area.focus();
  area.select();

  const res = document.execCommand('copy');

  area.remove();

  return res;
}

export function $copy (text: string) {
  return navigator.clipboard !== void 0
    ? navigator.clipboard.writeText(text)
    : new Promise<void>((resolve, reject) => {
      const res = fallback(text);

      if (res) {
        resolve();
      } else {
        reject(res);
      }
    });
}