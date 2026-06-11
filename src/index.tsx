import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { DictionaryEntry, getDictionaryData } from "./api.js";
import { WordDetail } from "./detail.js";
import { getNaverDictionaryUrl } from "./function.js";

export default function Command(): JSX.Element {
  const [searchText, setSearchText] = useState("");
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const latestSearchId = useRef(0);

  const handleSearchTextChange = (text: string) => {
    latestSearchId.current += 1;
    setSearchText(text);
  };

  useEffect(() => {
    const searchId = latestSearchId.current;
    const trimmedSearchText = searchText.trim();

    if (!trimmedSearchText) {
      setDictionaryData([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getDictionaryData(trimmedSearchText);
        if (latestSearchId.current === searchId) {
          setDictionaryData(data);
        }
      } catch (error) {
        if (latestSearchId.current === searchId) {
          console.error("An error occurred:", error);
          await showToast({
            style: Toast.Style.Failure,
            title: "검색 실패",
            message: error instanceof Error ? error.message : "사전 검색 중 오류가 발생했습니다",
          });
        }
      } finally {
        if (latestSearchId.current === searchId) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  return (
    <List onSearchTextChange={handleSearchTextChange} isLoading={isLoading} searchBarPlaceholder="Search word...">
      {dictionaryData?.map((el) => (
        <List.Item
          key={el.id}
          title={el.title}
          subtitle={el.subtitle}
          actions={
            <ActionPanel>
              <Action.Push title="상세보기" target={<WordDetail word={el.title} subtitle={el.subtitle} />} />
              <Action.CopyToClipboard title="단어 복사" content={el.title} />
              <Action.CopyToClipboard
                title="첫 번째 뜻 복사"
                content={el.subtitle.split(",")[0]?.trim() || el.subtitle}
                shortcut={{ modifiers: ["cmd"], key: "1" }}
              />
              <Action.CopyToClipboard
                title="전체 뜻 복사"
                content={el.subtitle}
                shortcut={{ modifiers: ["cmd"], key: "a" }}
              />
              <Action.OpenInBrowser
                title="네이버 사전에서 열기"
                url={getNaverDictionaryUrl(el.title)}
                shortcut={{ modifiers: ["cmd"], key: "`" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
