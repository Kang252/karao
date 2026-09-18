const APPLE_SEARCH_URL = 'https://itunes.apple.com/search';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const rawQuery = Array.isArray(request.query.q) ? request.query.q[0] : request.query.q;
  const query = String(rawQuery || '').trim();

  if (query.length < 2) return response.status(200).json({ resultCount: 0, results: [] });
  if (query.length > 100) return response.status(400).json({ error: 'Từ khóa quá dài' });

  const params = new URLSearchParams({
    term: query,
    country: 'vn',
    media: 'music',
    entity: 'song',
    limit: '50',
    explicit: 'No',
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    // Apple redirects iPhone user agents to the non-HTTP `musics:` scheme.
    // Calling it server-side keeps the API response consistent on every device.
    const appleResponse = await fetch(`${APPLE_SEARCH_URL}?${params}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'singkangsong-web/1.0' },
    });
    if (!appleResponse.ok) throw new Error(`Apple Search returned ${appleResponse.status}`);

    const data = await appleResponse.json();
    response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return response.status(200).json(data);
  } catch (error) {
    const timedOut = error?.name === 'AbortError';
    return response.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Tìm kiếm quá thời gian' : 'Kho nhạc tạm thời không phản hồi',
    });
  } finally {
    clearTimeout(timeout);
  }
}
