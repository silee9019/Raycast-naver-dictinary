export function getNaverDictionaryUrl(text: string): string {
  return `https://en.dict.naver.com/#/search?query=${encodeURIComponent(text)}`;
}
