const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/send-message", async (req, res) => {
  const { receiverToken, title, body } = req.body;

  if (
    !Array.isArray(receiverToken) ||
    receiverToken.length === 0 ||
    !title ||
    !body
  ) {
    return res.status(400).send("Missing or invalid required fields");
  }

  const tokens = receiverToken;

  const message = {
    notification: {
      title,
      body,
    },
    tokens: tokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);

    console.log(JSON.stringify(response.responses, null, 2));

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
