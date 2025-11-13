import { GoogleGenerativeAI } from "@google/generative-ai";

interface ContentGenerationRequest {
  type: "post" | "story" | "reel" | "carousel";
  category: string;
  theme: string;
  customPrompt: string;
  tone: string;
  businessName?: string;
  targetAudience?: string;
}

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  cta?: string;
  suggestions?: string[];
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor() {
    this.initializeAI();
  }

  private initializeAI() {
    let apiKey: string;
    try {
      apiKey = useRuntimeConfig().public.GEMINI_API_KEY;
    } catch (error) {
      // Fallback to environment variable if useRuntimeConfig fails
      apiKey = process.env.GEMINI_API_KEY || "";
    }

    if (!apiKey) {
      console.warn(
        "Gemini AI API key not found. AI features will be disabled."
      );
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
    }
  }

  async generateContent(
    request: ContentGenerationRequest
  ): Promise<GeneratedContent> {
    if (!this.model) {
      throw new Error("Gemini AI not initialized. Please check your API key.");
    }

    const prompt = this.buildPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error("Error generating content with Gemini AI:", error);
      throw new Error("Failed to generate content. Please try again.");
    }
  }

  async generateHashtags(topic: string, category: string): Promise<string[]> {
    if (!this.model) {
      throw new Error("Gemini AI not initialized. Please check your API key.");
    }

    const prompt = `
      Generate 10-15 relevant hashtags for a ${category} business posting about "${topic}" on Instagram.
      
      Requirements:
      - Mix of popular and niche hashtags
      - Include Portuguese hashtags
      - Avoid overly generic hashtags
      - Include business category specific hashtags
      - Format: Return only hashtags separated by commas, each starting with #
      
      Topic: ${topic}
      Business Category: ${category}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.startsWith("#"))
        .slice(0, 15);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      return this.getFallbackHashtags(category);
    }
  }

  async generateCaption(
    topic: string,
    tone: string,
    businessType: string
  ): Promise<string> {
    if (!this.model) {
      throw new Error("Gemini AI not initialized. Please check your API key.");
    }

    const prompt = `
      Create an engaging Instagram caption for a ${businessType} business.
      
      Topic: ${topic}
      Tone: ${tone}
      
      Requirements:
      - Write in Portuguese (Brazil)
      - Use emojis appropriately
      - Include a call-to-action
      - Keep it engaging and authentic
      - Length: 100-300 characters
      - Match the ${tone} tone
      
      Return only the caption text without hashtags.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("Error generating caption:", error);
      return this.getFallbackCaption(topic, tone);
    }
  }

  async generateContentIdeas(
    businessType: string,
    count: number = 5
  ): Promise<string[]> {
    if (!this.model) {
      throw new Error("Gemini AI not initialized. Please check your API key.");
    }

    const prompt = `
      Generate ${count} creative content ideas for a ${businessType} business to post on Instagram.
      
      Requirements:
      - Ideas should be engaging and relevant to the business type
      - Mix of promotional and educational content
      - Consider current trends and seasonal relevance
      - Write in Portuguese (Brazil)
      - Each idea should be 1-2 sentences
      
      Return as a numbered list.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text
        .split("\n")
        .filter((line) => line.trim() && /^\d+\./.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .slice(0, count);
    } catch (error) {
      console.error("Error generating content ideas:", error);
      return this.getFallbackContentIdeas(businessType);
    }
  }

  private buildPrompt(request: ContentGenerationRequest): string {
    const {
      type,
      category,
      theme,
      customPrompt,
      tone,
      businessName,
      targetAudience,
    } = request;

    return `
      Create Instagram ${type} content for a ${category} business.
      
      Content Details:
      - Theme: ${theme}
      - Custom Description: ${customPrompt}
      - Tone: ${tone}
      ${businessName ? `- Business Name: ${businessName}` : ""}
      ${targetAudience ? `- Target Audience: ${targetAudience}` : ""}
      
      Requirements:
      - Write in Portuguese (Brazil)
      - Create engaging caption (100-300 characters)
      - Include relevant emojis
      - Suggest 8-12 hashtags
      - Add a call-to-action
      - Match the ${tone} tone
      - Be authentic and engaging
      
      Format your response as JSON:
      {
        "caption": "The main caption text",
        "hashtags": ["#hashtag1", "#hashtag2", ...],
        "cta": "Call to action text",
        "suggestions": ["Alternative caption 1", "Alternative caption 2"]
      }
    `;
  }

  private parseResponse(text: string): GeneratedContent {
    try {
      // Try to parse as JSON first
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          caption: parsed.caption || "",
          hashtags: parsed.hashtags || [],
          cta: parsed.cta,
          suggestions: parsed.suggestions || [],
        };
      }

      // Fallback: parse manually
      const lines = text.split("\n").filter((line) => line.trim());
      const caption =
        lines
          .find((line) => line.includes("caption") || line.length > 50)
          ?.replace(/^[^:]*:/, "")
          .trim() || "";
      const hashtags = text.match(/#\w+/g) || [];

      return {
        caption,
        hashtags: hashtags.slice(0, 12),
        cta: "Clique no link da bio para saber mais!",
        suggestions: [],
      };
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return this.getFallbackContent();
    }
  }

  private getFallbackContent(): GeneratedContent {
    return {
      caption:
        "🌟 Novidade incrível chegando! Fiquem ligados para mais detalhes. ✨",
      hashtags: ["#novidade", "#qualidade", "#negocio", "#empreendedorismo"],
      cta: "Clique no link da bio para saber mais!",
      suggestions: [],
    };
  }

  private getFallbackHashtags(category: string): string[] {
    const commonHashtags = [
      "#negocio",
      "#empreendedorismo",
      "#qualidade",
      "#brasil",
    ];
    const categoryHashtags: Record<string, string[]> = {
      restaurant: ["#restaurante", "#comida", "#gastronomia", "#delivery"],
      retail: ["#loja", "#varejo", "#produtos", "#ofertas"],
      services: ["#servicos", "#atendimento", "#profissional"],
      beauty: ["#beleza", "#estetica", "#cuidados", "#autoestima"],
      fitness: ["#fitness", "#saude", "#exercicios", "#bemestar"],
      technology: ["#tecnologia", "#inovacao", "#digital"],
      education: ["#educacao", "#aprendizado", "#conhecimento"],
    };

    return [...commonHashtags, ...(categoryHashtags[category] || [])];
  }

  private getFallbackCaption(topic: string, tone: string): string {
    const templates = {
      professional: `Apresentamos: ${topic}. Qualidade e excelência em cada detalhe. 💼`,
      friendly: `Olá pessoal! 👋 Vem conhecer nosso ${topic}. Vocês vão amar! ❤️`,
      casual: `Oi gente! 😊 Dá uma olhada nesse ${topic} incrível! 🔥`,
      enthusiastic: `🎉 INCRÍVEL! ${topic} chegou e está DEMAIS! Não percam! 🚀`,
      informative: `📚 Saiba mais sobre ${topic}. Informações importantes para você! 💡`,
      humorous: `😄 ${topic} tão bom que até eu me surpreendi! Vem conferir! 😂`,
    };

    return templates[tone as keyof typeof templates] || templates.friendly;
  }

  private getFallbackContentIdeas(businessType: string): string[] {
    const ideas: Record<string, string[]> = {
      restaurant: [
        "Mostre o preparo de um prato especial nos bastidores",
        "Compartilhe a história de um ingrediente especial",
        "Faça uma enquete sobre o sabor favorito dos clientes",
        "Apresente a equipe da cozinha",
        "Dicas de harmonização de pratos e bebidas",
      ],
      retail: [
        "Mostre diferentes formas de usar um produto",
        "Compartilhe depoimentos de clientes satisfeitos",
        "Faça um antes e depois com seus produtos",
        "Dicas de como escolher o produto ideal",
        "Bastidores da organização da loja",
      ],
      default: [
        "Compartilhe uma dica útil relacionada ao seu negócio",
        "Mostre os bastidores do seu trabalho",
        "Conte a história da sua empresa",
        "Faça uma pergunta para engajar os seguidores",
        "Compartilhe um depoimento de cliente",
      ],
    };

    return ideas[businessType] || ideas.default;
  }

  isAvailable(): boolean {
    return this.model !== null;
  }
}

// Export factory function to avoid calling useRuntimeConfig at module level
let _geminiAI: GeminiAIService | null = null;

export function getGeminiAI(): GeminiAIService {
  if (!_geminiAI) {
    _geminiAI = new GeminiAIService();
  }
  return _geminiAI;
}

// Legacy export for backward compatibility
export const geminiAI = {
  get instance() {
    return getGeminiAI();
  },
  // Proxy methods for backward compatibility
  isAvailable() {
    return getGeminiAI().isAvailable();
  },
  async generateContent(request: ContentGenerationRequest) {
    return getGeminiAI().generateContent(request);
  },
  async generateHashtags(topic: string, category: string) {
    return getGeminiAI().generateHashtags(topic, category);
  },
  async generateCaption(prompt: string, tone: string, businessType: string) {
    return getGeminiAI().generateCaption(prompt, tone, businessType);
  },
  async generateContentIdeas(businessType: string, count?: number) {
    return getGeminiAI().generateContentIdeas(businessType, count);
  },
};

// Export types
export type { ContentGenerationRequest, GeneratedContent };
