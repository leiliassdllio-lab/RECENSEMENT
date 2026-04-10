import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const NYCKEL_API_TOKEN = defineSecret("NYCKEL_API_TOKEN");
const NYCKEL_FUNCTION_ID = "hedgehog-species-identifier";

function normalizeNyckelPayload(payload){
  const topLabel = payload?.labelName || "Inconnu";
  const topConfidence = Number(payload?.confidence || 0);
  const labelConfidences = Array.isArray(payload?.labelConfidences)
    ? payload.labelConfidences
        .map(item => ({
          labelName: item?.labelName || "Inconnu",
          confidence: Number(item?.confidence || 0)
        }))
        .sort((a, b) => b.confidence - a.confidence)
    : [{
        labelName: topLabel,
        confidence: topConfidence
      }];

  return {
    labelName: topLabel,
    confidence: topConfidence,
    labelConfidences
  };
}

export const classifyHedgehogImage = onRequest(
  {
    cors: true,
    secrets: [NYCKEL_API_TOKEN]
  },
  async (req, res) => {
    if(req.method === "OPTIONS"){
      res.status(204).send("");
      return;
    }

    if(req.method !== "POST"){
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const imageData = req.body?.data;
    if(typeof imageData !== "string" || !imageData.startsWith("data:image/")){
      res.status(400).json({ error: "Image data URI is required" });
      return;
    }

    try{
      const nyckelResponse = await fetch(
        `https://www.nyckel.com/v1/functions/${NYCKEL_FUNCTION_ID}/invoke?labelCount=3`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NYCKEL_API_TOKEN.value()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: imageData })
        }
      );

      const rawText = await nyckelResponse.text();
      const payload = rawText ? JSON.parse(rawText) : {};

      if(!nyckelResponse.ok){
        res.status(nyckelResponse.status).json({
          error: "Nyckel request failed",
          details: payload
        });
        return;
      }

      res.json(normalizeNyckelPayload(payload));
    }catch(error){
      console.error("Unable to classify image with Nyckel.", error);
      res.status(500).json({ error: "Unable to classify image" });
    }
  }
);
