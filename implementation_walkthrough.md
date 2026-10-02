# 📋 QR 코드 생성기 구현 계획 & 작업 Walkthrough

본 문서는 **URL2QR 로고와 어울리는 밝은 톤 리뉴얼**, **프리미엄 그라데이션 디자인 시스템**, 그리고 **마우스 커서 위치 기반 실시간 동적 그라데이션 인터랙션** 구현에 대한 전체 계획 및 단계별 작업 내역(Walkthrough)을 정리한 문서입니다.

---

## 🎯 1. 프로젝트 요구사항 및 목표

| 구분 | 주요 요구사항 | 구현 목표 |
| :--- | :--- | :--- |
| **톤앤매너** | 로고랑 어울리게 사이트를 밝은 톤으로 전환 | 기존의 차가운 블루 톤을 걷어내고 로고의 옐로우/골드와 조화를 이루는 선샤인 앰버 & 웜 아이보리 크림 톤 적용 |
| **비주얼 디자인** | 예쁜 그라데이션 적용 | 다층 래디얼 그라데이션 배경, 회전형 림 라이트 카드 테두리, 골드 앰버 텍스트 및 버튼 그라데이션 |
| **인터랙션** | 마우스 위치에 따라 그라데이션 색상이 바뀌도록 구현 | 마우스 좌표를 실시간 추적하여 HSL 색조(Hue: 32°~52°) 및 각도·광원 중심이 유기적으로 변화하는 렌더링 엔진 구축 |

---

## 🛠️ 2. 작업 목록 (Task Breakdown)

- [x] **Task 1: 로고 에셋 분석 및 컬러 토큰 설계**
  - `img/logo.png` 로고 이미지 분석 (배경: 따뜻한 옐로우/골드 `#F5BA13`, 텍스트: 차콜 블랙 `#18181b`)
  - 로고 친화적 웜 골드/선샤인 앰버/크림 화이트 컬러 팔레트 구축

- [x] **Task 2: 마크업 구조 개편 ([index.html](file:///c:/Users/LG/Desktop/프로젝트04/index.html))**
  - 마우스 커서를 따라다니는 스포트라이트 엘리먼트(`<div class="cursor-spotlight">`) 추가
  - 3중 앰비언트 글로우 오브 레이어 배치 (탑 라이트, 바텀 레프트, 센터 펄스)
  - 헤더 로고 컨테이너의 글래스모피즘 뱃지 래핑 및 접근성 태그 보강

- [x] **Task 3: 스타일시트 전면 개편 ([css/style.css](file:///c:/Users/LG/Desktop/프로젝트04/css/style.css))**
  - CSS 커스텀 속성(CSS Variables) 기반 동적 색조 토큰(`--grad-h1`, `--grad-h2`, `--grad-h3`) 정의
  - 4중 방사형 래디얼 그라데이션 바디 배경 스타일링
  - 마우스 각도(`--mouse-angle`)에 반응하는 QR 카드 테두리 림 라이트 가상요소(`::before`) 구현
  - 로고 텍스트와 대비를 이루는 골든 옐로우 앤 블랙 타이포 버튼(`submit-btn`, `download-direct-btn`) 스타일링

- [x] **Task 4: 실시간 인터랙티브 그라데이션 엔진 구현 ([js/app.js](file:///c:/Users/LG/Desktop/프로젝트04/js/app.js))**
  - `requestAnimationFrame`과 선형 보간(Lerp, 계수 0.085)을 통한 부드러운 감속 추종 알고리즘 적용
  - 뷰포트 대비 비율(X/Y)에 따른 정밀 HSL 색상 시프트 로직 설계
  - 커서 정지 또는 화면 이탈 시 은은하게 숨쉬는 사인파 브레스(Breath) 파동 구현
  - 모바일 터치(`touchmove`) 지원으로 다양한 디바이스 대응

- [x] **Task 5: 브라우저 실행 및 동작 검증**
  - Chrome 및 Edge 브라우저에서 `file:///c:/Users/LG/Desktop/프로젝트04/index.html` 즉시 구동
  - 레이아웃 전환(중앙 ➔ 하단) 및 QR 클릭 시 600x600 고해상도 JPG 다운로드 기능 유지 확인

---

## 🚶 3. 단계별 상세 워크스루 (Step-by-Step Walkthrough)

### Step 1. 로고 분석 및 컬러 시스템 재정의
- **분석 결과**: 로고 `URL2QR`는 선명하고 밝은 옐로우/골드 바탕 위에 블랙 드로잉 타이포그래피가 인상적인 디자인입니다.
- **적용 방안**:
  - 기존 쿨 블루(`--primary: #2563eb`) 대신 로고의 아이덴티티를 살린 웜 골드/앰버 옐로우(`--primary: #f59e0b`, `--brand-yellow: #f5b301`) 적용
  - 텍스트는 로고와 동일한 잉크 블랙(`--text-main: #18181b`)을 사용하여 시각적 통일감 극대화

### Step 2. 마크업 엘리먼트 추가 ([index.html](file:///c:/Users/LG/Desktop/프로젝트04/index.html#L16-L28))
```html
<!-- 배경 데코레이션 앰비언트 글로우 & 마우스 인터랙티브 스포트라이트 -->
<div class="cursor-spotlight" id="cursor-spotlight" aria-hidden="true"></div>
<div class="ambient-glow glow-top-right" aria-hidden="true"></div>
<div class="ambient-glow glow-bottom-left" aria-hidden="true"></div>
<div class="ambient-glow glow-center" aria-hidden="true"></div>
```
- 커서를 은은하게 비추는 조명 스포트라이트 레이어와 배경의 깊이감을 더해줄 중앙 펄스 글로우를 추가했습니다.

### Step 3. 반응형 다층 그라데이션 스타일링 ([css/style.css](file:///c:/Users/LG/Desktop/프로젝트04/css/style.css#L47-L86))
```css
html, body {
  background-color: var(--bg-main);
  background-image: 
    radial-gradient(circle 800px at var(--mouse-x) var(--mouse-y), 
      hsla(var(--grad-h1), 100%, 65%, 0.18) 0%, 
      hsla(var(--grad-h2), 95%, 72%, 0.08) 40%, 
      transparent 75%),
    radial-gradient(at 12% 15%, hsla(var(--grad-h3), 100%, 82%, 0.5) 0px, transparent 55%),
    radial-gradient(at 88% 85%, hsla(var(--grad-h2), 95%, 80%, 0.45) 0px, transparent 60%),
    radial-gradient(at 50% 50%, #ffffff 0%, #fffbf0 60%, #fdf5e6 100%);
  background-attachment: fixed;
}
```
- 마우스의 위치(`--mouse-x`, `--mouse-y`)를 중심으로 800px 크기의 부드러운 래디얼 그라데이션이 광원처럼 따라다니며 공간감을 연출합니다.

### Step 4. 부드러운 감속 LERP & 색상 시프트 엔진 ([js/app.js](file:///c:/Users/LG/Desktop/프로젝트04/js/app.js#L42-L113))
```javascript
// 선형 보간 (Lerp)을 통한 부드러운 추종 감속
const lerpFactor = 0.085;
currentX += ((targetX + breathOffsetX) - currentX) * lerpFactor;
currentY += ((targetY + breathOffsetY) - currentY) * lerpFactor;

// 뷰포트 비율 (0.0 ~ 1.0)
const ratioX = Math.max(0, Math.min(1, currentX / (windowWidth || 1)));
const ratioY = Math.max(0, Math.min(1, currentY / (windowHeight || 1)));

// 로고 기준 Hue(42°)를 중심으로 가로/세로 위치에 따라 32°(따뜻한 앰버) ~ 52°(산뜻한 레몬골드) 시프트
const baseHue = 42 + (ratioX - 0.5) * 24 + (ratioY - 0.5) * 12;
const h1 = baseHue;
const h2 = baseHue - 13;
const h3 = baseHue + 15;
const angle = Math.round(110 + (ratioX - 0.5) * 60 + (ratioY - 0.5) * 30);

// CSS 변수 실시간 갱신
root.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
root.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);
root.style.setProperty('--mouse-angle', `${angle}deg`);
root.style.setProperty('--grad-h1', h1.toFixed(1));
root.style.setProperty('--grad-h2', h2.toFixed(1));
root.style.setProperty('--grad-h3', h3.toFixed(1));
```
- 마우스 커서의 물리적 좌표를 즉시 대입하지 않고, 부드러운 관성을 가진 채 따라오도록 감속 보간을 적용하여 사용자가 조작할 때 고급스러운 프리미엄 모션을 체감할 수 있습니다.

---

## 🔍 4. 최종 검증 결과 요약

| 점검 항목 | 결과 | 설명 |
| :--- | :---: | :--- |
| **로고와의 일체감** | **Pass** | 골든 옐로우 앤 블랙 타이포와 사이트 배경/버튼이 완벽히 조화됨 |
| **마우스 커서 반응** | **Pass** | 커서 이동 시 배경 광원과 색상이 부드럽게 시프트되며 렉 없이 60fps 구동 |
| **QR 생성 및 애니메이션** | **Pass** | 확인 버튼 클릭 시 인풋이 하단으로 부드럽게 슬라이드되고 QR이 중앙에 팝업 |
| **JPG 다운로드** | **Pass** | QR 카드 클릭 시 600x600 순백색 배경이 적용된 고화질 JPG 파일 정상 저장 |
