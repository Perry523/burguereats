import { $fetch } from 'ofetch';

let tokenCache: { token: string; expiresAt: number } | null = null;

export const getIfoodToken = async () => {
  const clientId = process.env.IFOOD_CLIENT_ID;
  const clientSecret = process.env.IFOOD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing iFood credentials in .env (IFOOD_CLIENT_ID/IFOOD_CLIENT_SECRET)');
  }

  // Check cache
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) {
    return tokenCache.token;
  }

  try {
    const response = await $fetch<any>('https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        clientId,
        clientSecret,
      }).toString(),
    });

    if (response.accessToken) {
      tokenCache = {
        token: response.accessToken,
        expiresAt: Date.now() + (response.expiresIn * 1000),
      };
      return response.accessToken;
    }
    throw new Error('Failed to get iFood access token');
  } catch (error: any) {
    console.error('iFood Auth Error:', error.data || error.message);
    throw error;
  }
};

export const fetchIfoodOrderDetails = async (orderId: string) => {
  const token = await getIfoodToken();
  const response = await $fetch<any>(`https://merchant-api.ifood.com.br/order/v1.0/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const acknowledgeIfoodOrder = async (orderId: string) => {
  const token = await getIfoodToken();
  await $fetch(`https://merchant-api.ifood.com.br/order/v1.0/orders/${orderId}/acknowledgement`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};
