// Miscellaneos utils not exported in index.ts

export function center_moment(raw: {
  m: number;
  m2: number;
  m3: number;
  m4?: number;
}): { u: number; u2: number; u3: number; u4?: number } {
  const { m, m2, m3, m4 } = raw;
  const m_sq = m * m;
  const m_cubic = m * m_sq;
  const m_quad = m4 === undefined ? 0 : m_sq * m_sq;

  const result = {
    u: m,
    u2: m2 - m_sq,
    u3: m3 - 3 * m * m2 + 2 * m_cubic,
  };

  if (m4 === undefined) {
    return result;
  }

  return {
    ...result,
    u4: m4 - 4 * m * m3 + 6 * m_sq * m2 - 3 * m_quad,
  };
}
