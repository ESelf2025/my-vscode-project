import axios from "axios";

export async function createDIDVideo(script, imageUrl) {
    const apiKey = process.env.REACT_APP_DID_API_KEY;
  
    try {
      const response = await axios.post(
        "http://localhost:5001/proxy/talks",
        {
          script: {
            type: "text",
            input: script,
          },
          source_url: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("🔥 createDIDVideo ERROR", error);
      throw error;
    }
  }
  