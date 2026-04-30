# search-naver-en-ko-dictionary

This extension is for searching English-Korean dictionary on Naver. If you search a word in English or Korean, you can get the result of the word in English and Korean.

### Usage
- 검색어를 입력하면 네이버 영한 사전 자동완성 결과가 표시됩니다.
- `Enter`: 선택한 단어의 상세 보기를 엽니다.
- `CMD + 1`: 첫 번째 뜻을 클립보드에 복사합니다.
- `CMD + A`: 전체 뜻을 클립보드에 복사합니다.
- <kbd>CMD</kbd> + <kbd>`</kbd>: 선택한 단어를 네이버 사전에서 엽니다.
- 상세 보기에서 단어, 발음 기호를 복사하거나 발음 오디오/네이버 사전 페이지를 열 수 있습니다.

### How to Install (Raycast 적용 방법)

#### 사전 요구사항
- [Raycast](https://raycast.com/) 설치 필요
- [Node.js](https://nodejs.org/) 18.x 이상
- pnpm (권장)

#### 설치 단계

**1. 저장소 클론**
```bash
git clone https://github.com/silee9019/Raycast-naver-dictinary.git
cd Raycast-naver-dictinary
```

**2. 의존성 설치**
```bash
pnpm install
```

**3. 개발 모드로 실행**
```bash
pnpm run dev
```
> 이 명령어를 실행하면 Raycast가 자동으로 확장 프로그램을 인식합니다.

**4. Raycast에서 확장 프로그램 확인**
- Raycast 실행 (기본 단축키: `⌥ + Space`)
- "Search Naver" 입력하여 확장 프로그램 검색
- 검색 결과에 "Search Naver En Ko dictionary"가 표시되면 설치 완료!

#### 수동으로 Import하기 (선택사항)
개발 모드가 자동 인식되지 않는 경우:
1. Raycast 실행
2. "Import Extension" 검색 후 실행
3. 프로젝트 폴더 선택 (`Raycast-naver-dictinary`)
4. 확장 프로그램이 Raycast에 추가됨

#### 빌드 (배포용)
```bash
pnpm run build
```

### Reference 
- [alfnaversearch](https://github.com/Kuniz/alfnaversearch)
