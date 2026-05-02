import axios from "axios";
import { NaverDetailApiResponse, NaverWordItem, WordDetailData } from "./types.js";

const NAVER_SEARCH_API_URL = "https://en.dict.naver.com/api3/enko/search";
const REQUEST_TIMEOUT_MS = 5000;

export function getNaverEntryUrl(entryId: string): string {
  return `https://en.dict.naver.com/#/entry/enko/${encodeURIComponent(entryId)}`;
}

/**
 * 단어 상세 정보를 가져옵니다.
 * @returns WordDetailData - 성공 시 상세 정보
 * @returns null - 단어를 찾을 수 없음 (정상적인 "결과 없음")
 * @throws Error - API 호출 실패 (네트워크 오류, 서버 오류 등)
 */
export async function fetchWordDetail(word: string): Promise<WordDetailData | null> {
  if (!word?.trim()) {
    return null;
  }

  const response = await axios.get<NaverDetailApiResponse>(NAVER_SEARCH_API_URL, {
    timeout: REQUEST_TIMEOUT_MS,
    params: {
      m: "pc",
      query: word.trim(),
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://en.dict.naver.com/",
    },
  });

  const wordItems = response.data?.searchResultMap?.searchResultListMap?.WORD?.items;
  if (!wordItems || wordItems.length === 0) {
    return null; // "결과 없음" - 정상적인 상황
  }

  return parseWordItem(wordItems[0]);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\(→[^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseWordItem(item: NaverWordItem): WordDetailData {
  const phoneticInfo = item.searchPhoneticSymbolList?.find((p) => p.symbolValue);

  const meanings =
    item.meansCollector
      ?.filter((collector) => collector.means && collector.means.length > 0)
      .map((collector) => ({
        partOfSpeech: collector.partOfSpeech || collector.partOfSpeech2 || "기타",
        definitions: collector.means?.map((mean) => stripHtml(mean.value || "")).filter(Boolean) || [],
      }))
      .filter((m) => m.definitions.length > 0) || [];

  return {
    word: item.handleEntry || stripHtml(item.expEntry || ""),
    entryId: item.entryId,
    phonetic: phoneticInfo?.symbolValue,
    phoneticType: phoneticInfo?.symbolType || phoneticInfo?.symbolTypeCode,
    audioUrl: phoneticInfo?.symbolFile,
    source: item.sourceDictnameKO,
    dictType: item.expDictTypeForm,
    meanings,
  };
}
