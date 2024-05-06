export const generateRef = (text) => {
  const dateNow = new Date();
  const rn1 = Math.floor(Math.random() * 10);
  const rn2 = Math.floor(Math.random() * 10);
  const rn3 = Math.floor(Math.random() * 10);
  const h = dateNow.getHours();
  const i = dateNow.getMinutes();
  const s = dateNow.getSeconds();
  const y = dateNow.getFullYear();
  const m = dateNow.getMonth() + 1;
  const d = dateNow.getDate();
  const uniqCode = text + '-' + s + d + h + m + i + y + rn1 + rn2 + rn3;
  return uniqCode;
};
