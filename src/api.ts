import axios from "axios";
import * as crypto from "crypto";
import { DictionaryEntry } from "./types.js";

export type { DictionaryEntry } from "./types.js";

const NAVER_DICTIONARY_URL = "https://ac-dict.naver.com/enko/ac";
const REQUEST_TIMEOUT_MS = 5000;

/**
 * 네이버 자동완성 API 응답 구조
 * items[categoryIndex][entryIndex][fieldIndex][valueIndex]
 * - fieldIndex 0: 검색어 (영단어)
 * - fieldIndex 2: 뜻 (한글 번역)
 */
interface AutocompleteResponse {
  items?: AutocompleteField[][];
}

/**
 * 자동완성 항목의 필드 구조
 * - item[0][0]: 표제어
 * - item[2][0]: 번역(첫 번째 뜻)
 */
type AutocompleteField = string[][];

export async function getDictionaryData(word: string): Promise<DictionaryEntry[]> {
  if (!word?.trim()) {
    return [];
  }

  const trimmedWord = word.trim();

  const response = await axios.get<AutocompleteResponse>(NAVER_DICTIONARY_URL, {
    timeout: REQUEST_TIMEOUT_MS,
    params: {
      q_enc: "utf-8",
      st: 11001,
      r_format: "json",
      r_enc: "utf-8",
      r_lt: 10001,
      r_unicode: 0,
      r_escape: 1,
      q: trimmedWord,
    },
  });

  return processData(response.data);
}

function processData(data: AutocompleteResponse): DictionaryEntry[] {
  if (!data.items) {
    return [];
  }

  return data.items.flatMap((items) =>
    items
      .map((item) => {
        const title = item[0]?.[0];
        const subtitle = item[2]?.[0];
        if (!title || !subtitle) {
          return null;
        }

        return {
          id: crypto.randomUUID(),
          title,
          subtitle,
        };
      })
      .filter((entry): entry is DictionaryEntry => entry !== null)
  );
}
