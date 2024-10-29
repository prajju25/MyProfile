const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GPHOTOS_CLIENT_ID);

exports.handler = async (event, context) => {
  const token = event.headers.authorization?.split(" ")[1];

  if (!token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Access token is required" }),
    };
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GPHOTOS_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(403).json({ message: "Invalid audience" });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ...payload }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }
};
