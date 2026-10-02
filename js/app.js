/**
 * QR Code Generator - Main Application Script
 * Features:
 * - Logo-Matched Bright & Warm Sunshine Golden Palette
 * - Interactive Mouse-Driven Dynamic Gradients & Cursor Spotlight
 * - Smooth Lerp Animation & Breath Wave Fallback
 * - Instant High-Quality QR Code Generation
 * - Click-to-Download 600x600 JPG with crisp margins
 * - Clipboard Copy & State Management
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // DOM 요소 선택
  // --------------------------------------------------------------------------
  const body = document.body;
  const root = document.documentElement;
  const urlForm = document.getElementById('url-form');
  const urlInput = document.getElementById('url-input');
  const submitBtn = document.getElementById('submit-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const inputWrapper = document.getElementById('input-wrapper');
  const inputHelperMsg = document.getElementById('input-helper-msg');
  
  const qrCard = document.getElementById('qr-card');
  const qrCodeDisplay = document.getElementById('qr-code-display');
  const targetUrlDisplay = document.getElementById('target-url-display');
  const downloadDirectBtn = document.getElementById('download-direct-btn');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const newQrBtn = document.getElementById('new-qr-btn');
  const brandLogoLink = document.getElementById('brand-logo-link');
  const toastContainer = document.getElementById('toast-container');
  const cursorSpotlight = document.getElementById('cursor-spotlight');

  let currentQrInstance = null;
  let activeUrl = '';

  // --------------------------------------------------------------------------
  // 1. 마우스 인터랙티브 그라데이션 엔진 (Smooth Lerp + Sine Wave Breath)
  // --------------------------------------------------------------------------
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // 마우스 목표 좌표 및 현재 보간 좌표
  let targetX = windowWidth * 0.5;
  let targetY = windowHeight * 0.45;
  let currentX = targetX;
  let currentY = targetY;

  let isMouseActive = false;
  let lastMoveTime = performance.now();

  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });

  // 마우스 이동 감지
  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    isMouseActive = true;
    lastMoveTime = performance.now();
  }, { passive: true });

  // 모바일 터치 지원
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
      isMouseActive = true;
      lastMoveTime = performance.now();
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    isMouseActive = false;
  });

  // 애니메이션 루프 (매 프레임 실행)
  function renderGradientEngine(time) {
    // 마우스가 오랫동안 멈춰있거나 화면 밖일 때 은은하게 숨쉬는 사인파 효과
    const elapsedSinceMove = time - lastMoveTime;
    let breathOffsetX = 0;
    let breathOffsetY = 0;

    if (!isMouseActive || elapsedSinceMove > 1800) {
      const breathTime = time * 0.0012;
      breathOffsetX = Math.sin(breathTime) * 35;
      breathOffsetY = Math.cos(breathTime * 0.8) * 25;
    }

    // 선형 보간 (Lerp)을 통한 부드러운 추종 감속
    const lerpFactor = 0.085;
    currentX += ((targetX + breathOffsetX) - currentX) * lerpFactor;
    currentY += ((targetY + breathOffsetY) - currentY) * lerpFactor;

    // 뷰포트 비율 (0.0 ~ 1.0)
    const ratioX = Math.max(0, Math.min(1, currentX / (windowWidth || 1)));
    const ratioY = Math.max(0, Math.min(1, currentY / (windowHeight || 1)));

    // [로고 맞춤 색상 시프트 로직]
    // 기본 로고 옐로우 Hue는 약 42도(골든 옐로우)
    // 마우스의 가로 및 세로 위치에 따라 32도(따뜻한 앰버/오렌지) ~ 52도(산뜻한 선샤인 레몬골드) 사이를 우아하게 시프트
    const baseHue = 42 + (ratioX - 0.5) * 24 + (ratioY - 0.5) * 12;
    const h1 = baseHue;               // 메인 골드 옐로우
    const h2 = baseHue - 13;          // 웜 앰버 오렌지 힌트
    const h3 = baseHue + 15;          // 브라이트 레몬 선샤인
    const angle = Math.round(110 + (ratioX - 0.5) * 60 + (ratioY - 0.5) * 30);

    // CSS 변수 실시간 동기화
    root.style.setProperty('--mouse-x', `${currentX.toFixed(1)}px`);
    root.style.setProperty('--mouse-y', `${currentY.toFixed(1)}px`);
    root.style.setProperty('--mouse-ratio-x', ratioX.toFixed(3));
    root.style.setProperty('--mouse-ratio-y', ratioY.toFixed(3));
    root.style.setProperty('--mouse-angle', `${angle}deg`);
    root.style.setProperty('--grad-h1', h1.toFixed(1));
    root.style.setProperty('--grad-h2', h2.toFixed(1));
    root.style.setProperty('--grad-h3', h3.toFixed(1));

    // 커서 스포트라이트 위치 업데이트
    if (cursorSpotlight) {
      cursorSpotlight.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(renderGradientEngine);
  }

  requestAnimationFrame(renderGradientEngine);

  // --------------------------------------------------------------------------
  // 2. 입력창 인터랙션 (X 버튼 및 유효성)
  // --------------------------------------------------------------------------
  urlInput.addEventListener('input', () => {
    if (urlInput.value.trim().length > 0) {
      clearInputBtn.style.display = 'flex';
      hideError();
    } else {
      clearInputBtn.style.display = 'none';
    }
  });

  clearInputBtn.addEventListener('click', () => {
    urlInput.value = '';
    clearInputBtn.style.display = 'none';
    urlInput.focus();
    hideError();
  });

  function showError(msg) {
    inputHelperMsg.textContent = msg;
    inputHelperMsg.classList.add('visible');
    inputWrapper.classList.remove('shake');
    // 재실행을 위해 리플로우 강제
    void inputWrapper.offsetWidth;
    inputWrapper.classList.add('shake');
    urlInput.focus();
  }

  function hideError() {
    inputHelperMsg.textContent = '';
    inputHelperMsg.classList.remove('visible');
    inputWrapper.classList.remove('shake');
  }

  // --------------------------------------------------------------------------
  // 3. URL 정규화 & 검증
  // --------------------------------------------------------------------------
  function formatUrl(rawUrl) {
    let url = rawUrl.trim();
    if (!url) return '';

    // 일반적인 도메인 형태이고 프로토콜이 누락된 경우 https:// 기본 추가
    const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url);
    const isSpecialScheme = /^(mailto:|tel:|sms:)/i.test(url);

    if (!hasProtocol && !isSpecialScheme) {
      url = 'https://' + url;
    }
    return url;
  }

  // --------------------------------------------------------------------------
  // 4. QR 코드 생성 및 화면 모드 전환
  // --------------------------------------------------------------------------
  function generateQRCode() {
    const rawValue = urlInput.value;
    const formattedUrl = formatUrl(rawValue);

    if (!formattedUrl) {
      showError('QR코드로 변환할 URL이나 텍스트를 입력해 주세요.');
      return;
    }

    hideError();
    activeUrl = formattedUrl;
    targetUrlDisplay.textContent = formattedUrl;

    // 이전 QR코드 제거
    qrCodeDisplay.innerHTML = '';

    // 고해상도 QR 생성 (width: 256, height: 256)
    // 로고의 차콜 블랙과 순백색 배경 적용
    try {
      currentQrInstance = new QRCode(qrCodeDisplay, {
        text: formattedUrl,
        width: 256,
        height: 256,
        colorDark: '#18181b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      // 레이아웃 전환: 중앙 -> 하단
      body.classList.add('has-qr-mode');

      showToast('QR코드가 생성되었습니다! 클릭하여 JPG로 다운로드하세요.', 'success');
    } catch (err) {
      console.error('QR 생성 오류:', err);
      showError('QR 코드 생성 중 오류가 발생했습니다.');
    }
  }

  // 폼 제출 핸들러 (확인 버튼 또는 Enter 키)
  urlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    generateQRCode();
  });

  submitBtn.addEventListener('click', () => {
    generateQRCode();
  });

  // --------------------------------------------------------------------------
  // 5. QR 코드 JPG 다운로드 (요구사항: QR코드 클릭 시 JPG 다운로드)
  // --------------------------------------------------------------------------
  function downloadQRAsJPG() {
    if (!body.classList.contains('has-qr-mode')) return;

    // qrcode.js가 생성한 canvas 또는 img 요소를 검색
    const canvasElement = qrCodeDisplay.querySelector('canvas');
    const imgElement = qrCodeDisplay.querySelector('img');

    if (!canvasElement && !imgElement) {
      showToast('QR 코드 이미지를 찾을 수 없습니다.');
      return;
    }

    // 고해상도(600x600)의 오프스크린 캔버스 생성하여 순백색 배경 + 여백(Margin) 합성
    const exportSize = 600;
    const padding = 50; // 화이트 마진
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize;
    const ctx = exportCanvas.getContext('2d');

    // 1) 순백색 배경 채우기 (JPG는 투명배경이 검은색으로 나타나므로 필수)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportSize, exportSize);

    // 2) 렌더링 소스 결정 (canvas 우선, 없을 시 img)
    const drawSource = canvasElement || imgElement;

    // 부드러움 대신 픽셀 엣지를 선명하게 유지
    ctx.imageSmoothingEnabled = false;

    // 중앙에 패딩을 두고 QR 코드 그리기
    const qrDrawSize = exportSize - (padding * 2);
    ctx.drawImage(drawSource, padding, padding, qrDrawSize, qrDrawSize);

    // 3) JPG 데이터 URL 추출 (품질: 0.95)
    try {
      const jpgDataUrl = exportCanvas.toDataURL('image/jpeg', 0.95);

      // 파일명 결정 (도메인 추출 또는 기본 qrcode.jpg)
      let filename = 'qrcode.jpg';
      try {
        const parsed = new URL(activeUrl);
        const host = parsed.hostname.replace(/[^a-zA-Z0-9]/g, '_');
        if (host) {
          filename = `qrcode_${host}.jpg`;
        }
      } catch (e) {
        filename = 'qrcode.jpg';
      }

      // 가상 <a> 태그를 통한 다운로드 트리거
      const downloadLink = document.createElement('a');
      downloadLink.href = jpgDataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`'${filename}' JPG 파일이 다운로드되었습니다!`, 'success');
    } catch (e) {
      console.error('다운로드 생성 실패:', e);
      showToast('다운로드 이미지 생성 중 오류가 발생했습니다.');
    }
  }

  // QR 카드 클릭 시 JPG 다운로드
  qrCard.addEventListener('click', downloadQRAsJPG);

  // 키보드 접근성: QR 카드에 포커스 후 Enter나 Space 누르면 다운로드
  qrCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      downloadQRAsJPG();
    }
  });

  // 보조 JPG 다운로드 버튼 클릭
  downloadDirectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadQRAsJPG();
  });

  // --------------------------------------------------------------------------
  // 6. 보조 기능 (URL 복사, 새로 만들기, 로고 클릭)
  // --------------------------------------------------------------------------
  // URL 복사
  copyUrlBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!activeUrl) return;

    try {
      await navigator.clipboard.writeText(activeUrl);
      showToast('URL이 클립보드에 복사되었습니다!', 'success');
    } catch (err) {
      // 대체 복사 방식
      const tempInput = document.createElement('input');
      tempInput.value = activeUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('URL이 클립보드에 복사되었습니다!', 'success');
    }
  });

  // 처음으로 리셋 (새로 만들기 또는 상단 로고 클릭)
  function resetToInitialState() {
    body.classList.remove('has-qr-mode');
    setTimeout(() => {
      urlInput.value = '';
      clearInputBtn.style.display = 'none';
      hideError();
      urlInput.focus();
    }, 300);
  }

  newQrBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetToInitialState();
  });

  brandLogoLink.addEventListener('click', (e) => {
    e.preventDefault();
    resetToInitialState();
  });

  // --------------------------------------------------------------------------
  // 7. 토스트 알림 표시
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    toastContainer.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-information-fill';
    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3100);
  }

  // 초기 로드 시 입력창에 포커스
  urlInput.focus();
});
