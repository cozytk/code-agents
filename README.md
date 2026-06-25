# 코드 에이전트 셋 — Claude Code · Codex · Antigravity

세 코드 에이전트(Claude Code · OpenAI Codex · Google Antigravity)의 **공통점·차별점·성숙도**를 비교하는 발표 슬라이드입니다. [Slidev](https://sli.dev)로 제작했습니다.

🔗 **라이브:** https://cozytk.github.io/code-agents/

## 다루는 내용

- **공통점** — 셋 다 충분히 강하다: SWE-bench 76%+, DORA·Stack Overflow 설문, 계획→실행→검증 루프, 공통 인터페이스(CLI·IDE·데스크탑·웹·모바일)
- **차별점** — Claude Code(스킬·서브에이전트·신뢰성) · Codex(클라우드 위임·코드 리뷰) · Antigravity(Agent Manager·자율 검증)
- **인터페이스** — CLI에서 데스크탑 앱으로(왜 데스크탑을 권하는가)
- **모바일** — Remote Control / Codex Remote로 자리를 떠나서도 이어가기
- **실전 + 데모** — 단순 채팅을 넘어서는 활용, 그리고 이 덱 자체가 Claude Code로 만들어진 과정
- **성숙도** — 시장 점유율·안정성·선택 기준

브랜드 포인트 컬러: <span>Claude=주황</span> · <span>Codex=보라</span> · <span>Antigravity=블루</span>.
출처는 마지막 슬라이드 참조(공식문서·DORA·Stack Overflow·Menlo Ventures·The New Stack 등).

## 로컬 실행

```bash
pnpm install
pnpm dev          # http://localhost:3030
```

## 빌드 · 배포 (GitHub Pages)

```bash
pnpm build:base   # slidev build --base /code-agents/ + dead-preload 제거
```

## 제작 노트

이 발표 자료는 **Claude Code**가 `slidev-deck-builder` 스킬 + 병렬 서브에이전트 리서치 + 라이트/다크 캡처-검증 루프로 제작했습니다. 데모 섹션에 그 과정이 담겨 있습니다.
