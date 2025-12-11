export function generateLoginLinkToken(): string {
  const upper = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '123456789';
  const all = upper + lower + numbers;

  function randomChar(str: string) {
    return str[Math.floor(Math.random() * str.length)];
  }

  const result = [randomChar(upper), randomChar(lower), randomChar(numbers)];

  while (result.length < 6) {
    result.push(randomChar(all));
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}
