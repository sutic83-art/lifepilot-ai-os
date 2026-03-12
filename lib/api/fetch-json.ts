export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    const text = await res.text();
  
    let json: any;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`API nije vratio JSON. Početak odgovora: ${text.slice(0, 120)}`);
    }
  
    if (!res.ok) {
      throw new Error(json?.details || json?.error || "API request failed.");
    }
  
    return json as T;
  }