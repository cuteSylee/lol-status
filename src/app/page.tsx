"use client";

import { useState } from "react";

export default function Home() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    //새로고침 방지
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/match/latest?gameName=${gameName}&tagLine=${tagLine}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        return;
      }
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>한 판 리뷰</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="게임 이름 (예: Hide on bush)"
          required
        />
        <input
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="태그라인 (예: KR1)"
          required
        />
        <button type="submit">검색</button>
      </form>
      {loading && <p>조회 중...</p>}
      {error && <p>{error}</p>}
      {result && (
        <>
          <p>
            나 : {result.me.win ? "승리" : "패배"} · {result.me.championName}{" "}
            {result.me.kills} / {result.me.deaths} / {result.me.assists} · CS{" "}
            {result.me.cs}
          </p>
          {result.enemy ? (
            <>
              <p>
                상대 : {result.enemy.win ? "승리" : "패배"} ·{" "}
                {result.enemy.championName} {result.enemy.kills} /{" "}
                {result.enemy.deaths} / {result.enemy.assists} · CS{" "}
                {result.enemy.cs}
              </p>
              <p>CS 차이 : {result.diff?.cs}</p>
              <p>데스 차이 : {result.diff?.death}</p>
              <p>
                인사이트 : {result.insight ? result.insight : "승리했군요!!"}
              </p>
            </>
          ) : (
            <p>상대를 찾을 수 없습니다.</p>
          )}
        </>
      )}
    </main>
  );
}
