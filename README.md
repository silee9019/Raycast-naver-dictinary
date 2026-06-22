# search-naver-english-dictionary

This extension is for searching English-Korean dictionary on Naver. If you search a word in English or Korean, you can get the result of the word in English and Korean.

Raycast 표시 이름: `네이버 영한 사전`

### Usage
- 검색어를 입력하면 네이버 영한 사전 자동완성 결과가 표시됩니다.
- `Enter`: 선택한 단어의 상세 보기를 엽니다.
- `CMD + 1`: 첫 번째 뜻을 클립보드에 복사합니다.
- `CMD + A`: 전체 뜻을 클립보드에 복사합니다.
- <kbd>CMD</kbd> + <kbd>`</kbd>: 선택한 단어를 네이버 사전에서 엽니다.
- 상세 보기에서 단어, 발음 기호를 복사하거나 발음 오디오/네이버 사전 페이지를 열 수 있습니다.

### Development Commands
| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Raycast 개발 모드로 확장 프로그램을 실행합니다. |
| `pnpm run lint` | Raycast ESLint 설정으로 소스 코드를 검사합니다. |
| `pnpm run fix-lint` | 자동 수정 가능한 린트/포맷 문제를 정리합니다. |
| `pnpm run build` | 배포용 Raycast 확장 프로그램을 빌드합니다. |
| `pnpm run install-extension` | 빌드 후 로컬 Raycast에 확장 프로그램을 설치합니다. |
| `pnpm run publish` | Raycast 스토어 게시 플로우를 실행합니다. |

### How to Install (Raycast 적용 방법)

#### 사전 요구사항
- [Raycast](https://raycast.com/) 설치 필요
- [Node.js](https://nodejs.org/) 18.x 이상
- pnpm 9.15.4 (`package.json`의 `packageManager` 기준)

#### 설치 단계

**1. 저장소 클론**
```bash
git clone https://github.com/silee9019/Raycast-naver-dictinary.git
cd Raycast-naver-dictinary
```

**2. pnpm 버전 준비**
```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
```
> `package.json`의 `packageManager`와 동일한 pnpm 버전을 사용하면 잠금 파일 변경을 줄일 수 있습니다.

**3. 의존성 설치**
```bash
pnpm install
```

**4. 개발 모드로 실행**
```bash
pnpm run dev
```
> 이 명령어를 실행하면 Raycast가 자동으로 확장 프로그램을 인식합니다.

**4. Raycast에서 확장 프로그램 확인**
- Raycast 실행 (기본 단축키: `⌥ + Space`)
- "네이버 영한 사전" 또는 "단어 검색" 입력하여 확장 프로그램 검색
- 검색 결과에 "네이버 영한 사전"이 표시되면 설치 완료!

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

#### 로컬 Raycast에 빌드 후 설치 (macOS)
```bash
pnpm run install-extension
```

### Reference
- [alfnaversearch](https://github.com/Kuniz/alfnaversearch)
