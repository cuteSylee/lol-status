# lol-stats — 한 판 리뷰

롤 전적 나열이 아니라, **최근 한 판을 기준으로 “왜 졌을지” 후보를 보여주는** 개인용 툴입니다.

## 목표

- Riot ID로 소환사 검색
- 최근 경기 1판 불러오기
- 승패 / KDA / CS 등 핵심 지표 표시
- (이후) 같은 라인 상대 비교 + 패인 후보 한줄 요약

일반 전적 사이트 클론이 아니라, **패배 원인 힌트**에 집중합니다.
Riot 데이터로 확정 원인은 알 수 없어서, 숫자 기반의 **유력 후보 1~3개**를 보여주는 방향입니다.

## 오늘(1회차) 범위

- [x] 프로젝트 방향 정리
- [ ] Riot API 키 + `.env.local`
- [ ] Riot ID 검색
- [ ] 최근 매치 1개 조회
- [ ] 화면에 `승/패 · 챔프 · K/D/A · CS` 표시

## 의도적으로 나중에 할 것

- 패인 문장 규칙
- 아이템/룬 이미지
- 랭크/다수 전적 리스트
- DB, 로그인, 예쁜 UI

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Riot Games API (Account-V1, Match-V5)

## 시작하기

```bash
npm install
npm run dev
```

`.env.local` 예시:

```bash
RIOT_API_KEY=your_key_here
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

> > > > > > > ababae4 (Initial commit from Create Next App)
