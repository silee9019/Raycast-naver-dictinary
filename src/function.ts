import { dictionaries, type DictionaryCode } from "./dictionaries.js";

export function getNaverDictionaryUrl(text: string, dictionaryCode: DictionaryCode): string {
  return `${dictionaries[dictionaryCode].webBaseUrl}/#/search?query=${encodeURIComponent(text)}`;
}
