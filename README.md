# FocusPot Client 🐾

> 친구들과 함께하는 데스크탑 오버레이 타이머 — 프론트엔드

[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📌 프로젝트 소개

FocusPot은 유튜브 PiP처럼 **화면 위에 항상 떠있는 오버레이 앱**입니다.  
친구들과 방 코드를 공유하면 각자의 캐릭터(고양이/햄스터/강아지)와 타이머가 실시간으로 동기화됩니다.  
공부, 작업, 무엇이든 — 혼자지만 함께하는 느낌으로.

---

## 🖥️ 주요 기능

- 항상 최상단 투명 오버레이 (어떤 앱 위에서도 보임)
- 6자리 코드로 방 생성 및 친구 초대
- 기본 캐릭터 3종 (고양이 / 햄스터 / 강아지) 또는 직접 이미지/GIF 업로드
- 실시간 타이머 동기화 (클릭으로 정지/재개)
- 말풍선으로 텍스트 + 이모지 공유
- 로그인 없이 닉네임만으로 바로 참여

---

## 🛠️ 기술 스택

| 기술 | 역할 |
|------|------|
| Electron | 데스크탑 앱, 항상 최상단 투명 오버레이 창 |
| React + TypeScript | UI 전체 구성 |
| Vite | 빌드 도구 |
| Tailwind CSS | 스타일링 |
| Zustand | 전역 상태 관리 |
| STOMP.js | WebSocket 실시간 통신 |

---

## 🚀 시작하기

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build

# 패키징 (.exe / .dmg)
npm run package
```

---

## 📁 프로젝트 구조

```
focuspot-client/
├── electron/
│   ├── main.ts         # Electron Main Process
│   └── preload.ts      # IPC 브릿지
├── src/
│   ├── pages/          # StartScreen, ProfileSetup, OverlayMain
│   ├── components/     # FriendCard, Timer, SpeechBubble 등
│   ├── store/          # Zustand 상태 관리
│   ├── hooks/          # useWebSocket 등
│   └── api/            # HTTP REST 요청
└── vite.config.ts
```

---

## 🔗 관련 레포지토리

- 백엔드: [focuspot-server](https://github.com/Focuspot/Focuspot-Server)
