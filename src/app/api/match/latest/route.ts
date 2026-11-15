import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameName = searchParams.get("gameName");
  const tagLine = searchParams.get("tagLine");

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: "게임 이름과 태그라인이 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RIOT_API_KEY 환경 변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const headers = { "X-Riot-Token": apiKey };

  //계정
  const accountRes = await fetch(
    `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`,
    { headers }
  );

  if (!accountRes.ok) {
    return NextResponse.json(
      { error: "계정 정보를 찾을 수 없습니다." },
      { status: accountRes.status }
    );
  }

  const account = await accountRes.json();
  const puuid = account.puuid as string;

  //최근 매치
  const idsRes = await fetch(
    `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`,
    { headers }
  );

  if (!idsRes.ok) {
    return NextResponse.json(
      { error: "최근 매치 정보를 찾을 수 없습니다." },
      { status: idsRes.status }
    );
  }

  const matchIds: string[] = await idsRes.json();
  if (matchIds.length === 0) {
    return NextResponse.json(
      { error: "최근 매치 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  //매치 상세
  const matchRes = await fetch(
    `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIds[0]}`,
    { headers }
  );
  if (!matchRes.ok) {
    return NextResponse.json(
      { error: "매치 상세 정보를 찾을 수 없습니다." },
      { status: matchRes.status }
    );
  }
  const match = await matchRes.json();

  const me = match.info.participants.find((p: any) => p.puuid === puuid);
  if (!me) {
    return NextResponse.json(
      { error: "내 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const enemy = match.info.participants.find(
    (p: any) => p.teamId !== me.teamId && p.teamPosition === me.teamPosition
  );

  const meCs = me.totalMinionsKilled + me.neutralMinionsKilled;
  const enemyCs = enemy?.totalMinionsKilled + enemy?.neutralMinionsKilled;
  const csDiff = meCs - (enemyCs ?? 0);
  const deathDiff = me.deaths - (enemy?.deaths ?? 0);

  let insight: string | null = null;

  if (!me.win && enemy) {
    if (csDiff <= -20) {
      insight = "라인 CS 차이가 커서 성장이 밀린 판으로 보여집니다.";
    } else if (deathDiff >= 3) {
      insight = "상대보다 데스가 많아 템포가 준 판으로 보여집니다.";
    } else {
      insight = "라인 격차보다 한타/오브젝트 영향이 커 보여요. ";
    }
  }

  return NextResponse.json({
    me: {
      championName: me.championName,
      kills: me.kills,
      deaths: me.deaths,
      assists: me.assists,
      cs: me.totalMinionsKilled + me.neutralMinionsKilled,
      position: me.teamPosition,
      win: me.win,
      teamPosition: me.teamPosition,
    },
    enemy: enemy
      ? {
          championName: enemy.championName,
          kills: enemy.kills,
          deaths: enemy.deaths,
          assists: enemy.assists,
          cs: enemy.totalMinionsKilled + enemy.neutralMinionsKilled,
          position: enemy.teamPosition,
          win: enemy.win,
          teamPosition: enemy.teamPosition,
        }
      : null,
    insight: insight,
    diff: enemy ? { cs: csDiff, death: deathDiff } : null,
  });
}
