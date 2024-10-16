const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const res = await fetch(`${API_URL}${endpoint}`, mergedOptions);

  if (!res.ok) {
    console.error(await res.text());
    throw new Error('An error occurred while fetching the data.');
  }

  return res.json();
}

export async function searchActivos(query: string) {
  return fetchAPI(`/api/search?query=${encodeURIComponent(query)}`);
}

export async function createAnalisis(data: any) {
  return fetchAPI('/api/analisis', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAnalisis() {
  return fetchAPI('/api/analisis');
}