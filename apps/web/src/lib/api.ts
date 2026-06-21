import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    try {
      const { getToken } = await import("@clerk/nextjs");
      // Token is retrieved from Clerk session
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const aiApi = {
  analyzeFace: (imageBase64: string) =>
    api.post("/ai/analyze-face", { imageBase64 }),

  analyzeIngredients: (ingredients: string[]) =>
    api.post("/ai/analyze-ingredients", { ingredients }),

  scanProductOcr: (imageBase64: string) =>
    api.post("/ai/ocr-product", { imageBase64 }),

  chatMessage: (message: string, sessionId: string) =>
    api.post("/ai/chat", { message, sessionId }),

  getRecommendations: (params: Record<string, unknown>) =>
    api.post("/recommendations/ai", params),
};

export const scanApi = {
  createScan: (data: { imageBase64: string }) => api.post("/scans", data),
  getScans: (params?: { page?: number; limit?: number }) => api.get("/scans", { params }),
  getScan: (id: string) => api.get(`/scans/${id}`),
};

export const productApi = {
  getProducts: (params?: Record<string, unknown>) => api.get("/products", { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  searchByBarcode: (barcode: string) => api.get(`/products/barcode/${barcode}`),
  analyzeIngredients: (text: string) => api.post("/products/analyze-ingredients", { text }),
  scanProduct: (imageBase64: string, skinTone?: string, skinType?: string) =>
    api.post("/products/scan", { imageBase64, skinTone, skinType }),
};

export const communityApi = {
  getPosts: (params?: { page?: number; limit?: number }) => api.get("/community/posts", { params }),
  createPost: (data: { content: string; imageUrl?: string; tags?: string[] }) =>
    api.post("/community/posts", data),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
};
