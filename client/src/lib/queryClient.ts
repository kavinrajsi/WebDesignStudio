import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const isDev = import.meta.env.DEV;
  const baseURL = isDev 
    ? '' // In development, Vite proxy handles this
    : import.meta.env.VITE_API_URL || 'https://www.seoauditsolutions.com';
  
  const fullUrl = url.startsWith('http') ? url : 
                 (url.startsWith('/') ? `${baseURL}${url}` : `${baseURL}/${url}`);

  // Ensure headers are properly set
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Ensure credentials are included for cross-origin requests
  const credentials: RequestCredentials = isDev ? 'include' : 'same-origin';

  const res = await fetch(fullUrl, {
    ...options,
    headers,
    credentials,
    mode: 'cors',
    cache: 'no-cache'
  });

  await throwIfResNotOk(res);
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
