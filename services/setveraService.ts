import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, CreateBookingArgs } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SETVERA_SYSTEM_INSTRUCTION = `
# ROL VE KIMLIK
Sen Setvera.com'un akilli rezervasyon asistanisin. Gorevn, isletmeler icin gelen talepleri kusursuz bir sekilde yonetmek ve Google Takvim'e islemektir. Karakterin: Nazik, donust (Vera) ve son derece organize (Set).

# MODUL 1: RESTORAN REZERVASYON (ONCELIKLI)
Restoran taleplerinde su verileri eksiksiz almalsin:
1. Isim ve Soyisim
2. Kisi Sayisi (Yetiskin + Cocuk/Bebek sandalyesi ihtiyaci)
3. Tarih ve Saat (Ornek: Bugun, Yarin veya 15 Mart 20:00)
4. Alan Tercihi (Ic mekan, Teras, Cam kenari vb.)
5. Ozel Not (Alerji, Dogum gunu, Evlilik teklifi vb.)

# AKILLI KURALLAR
- ZAMAN YONETIMI: Restoran rezervasyonlarini varsayilan olarak 2 saat (120 dk) sureyle bloke et.
- CAKISMA SIMULASYONU: Eger masa kapasitesi dolmaya yakinsa, musteriye "Su an en populer saatimiz, isterseniz 15 dakika erken veya gec alabilirim" diyerek esneklik sagla.
- VERA DOKUNUSU: Onay almadan once mutlaka tum detaylari ozetle: "Sayln [Isim], [Tarih] saat [Saat]'te [Kisi Sayisi] kisilik masaniz [Alan] icin hazirlaniyor. Onayliyor musunuz?"
- NO-SHOW ENGELLEME: Rezervasyon kesinlesince "Gelemediginiz durumda lutfen 1 saat onceden haber verin" nezaketini goster.
- PAZARLAMA ZEKASI: Eger musteri "Yildonumu" diyorsa: "Harika bir kutlama! Masaniza kucuk bir susleme veya sampanya ikrami eklememizi ister misiniz?"
- GRUP YONETIMI: 10 kisi ve uzeri rezervasyonlarda: "Kalabalik gruplar icin ozel fix menu seceneklerimizi gormek ister misiniz?"

# SEKTÖREL GECIS HAZIRLIGI
Eger kullanici kuafor veya farkli bir sektordon bahsederse:
"Su an Restoran modulumuz aktif, ancak cok yakinda Setvera Guzellik modulumuzle de hizmetinizde olacagiz!"

# CIKTI FORMATI
Onay alindiginda MUTLAKA create_booking fonksiyonunu cagir.
`;

const CREATE_BOOKING_TOOL = {
    name: "create_booking",
    description: "Restoran veya diger sektorler icin randevuyu sisteme isler.",
    parameters: {
          type: Type.OBJECT,
          properties: {
                  business_type: {
                            type: Type.STRING,
                            description: "restaurant, beauty veya other"
                  },
                  customer_name: {
                            type: Type.STRING,
                            description: "Musterinin tam adi"
                  },
                  booking_summary: {
                            type: Type.STRING,
                            description: "Ornek: 4 Kisi - Teras - Dogum Gunu"
                  },
                  start_time: {
                            type: Type.STRING,
                            description: "ISO 8601 formati (YYYY-MM-DDTHH:mm:ss)"
                  },
                  end_time: {
                            type: Type.STRING,
                            description: "Baslangictan 120 dk sonrasi"
                  },
                  special_notes: {
                            type: Type.STRING,
                            description: "Ozel istekler, notlar"
                  }
          },
          required: ["business_type", "customer_name", "start_time", "end_time"]
    }
};

export interface SetveraResponse {
    text: string;
    functionCall?: {
      name: string;
      args: CreateBookingArgs;
    };
}

export const sendMessage = async (
    userMessage: string,
    history: ChatMessage[]
  ): Promise<SetveraResponse> => {
    const ai = getAI();

    const contents = [
          ...history.map(msg => ({
                  role: msg.role === 'user' ? 'user' : 'model',
                  parts: [{ text: msg.content }]
          })),
      {
              role: 'user',
              parts: [{ text: userMessage }]
      }
        ];

    const response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents,
          config: {
                  systemInstruction: SETVERA_SYSTEM_INSTRUCTION,
                  temperature: 0.3,
                  tools: [{ functionDeclarations: [CREATE_BOOKING_TOOL] }]
          }
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("Yanit alinamadi.");

    const textPart = candidate.content?.parts?.find(p => p.text);
    const funcPart = candidate.content?.parts?.find(p => p.functionCall);

    if (funcPart?.functionCall) {
          return {
                  text: textPart?.text || "Rezervasyon bilgileri isleniyor...",
                  functionCall: {
                            name: funcPart.functionCall.name || "create_booking",
                            args: funcPart.functionCall.args as CreateBookingArgs
                  }
          };
    }

    return {
          text: textPart?.text || "Uye zgunluk yakalayamadim, lutfen tekrar deneyin."
    };
};
