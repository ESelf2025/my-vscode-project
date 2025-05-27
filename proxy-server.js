const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.post("/proxy/talks", async (req, res) => {
  console.log("🔥 Received request:", req.body);

  try {
    const response = await axios.post(
      "https://api.d-id.com/talks",
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Proxy Error", error.response?.data || error.message);
    res.status(500).json({
      message: "Server error. Could not connect to D-ID.",
      error: error.response?.data || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
