const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GPHOTOS_CLIENT_ID);

exports.handler = async (event, context) => {
  const token = event.headers.authorization?.split(" ")[1];
  console.log("Verify Token Init: token:", token);
  console.log(
    "Verify Token: Client ID:",
    process.env.REACT_APP_GPHOTOS_CLIENT_ID
  );

  if (!token) {
    console.log("Verify Token: Error:Access token is required");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Access token is required" }),
    };
  }

  try {
    console.log("Verify Token process start");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GPHOTOS_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log("Verify Token process end. user payload:", payload);

    if (payload.aud !== process.env.REACT_APP_GPHOTOS_CLIENT_ID) {
      console.log("Verify Token: Error: Invalid audience");
      return res.status(403).json({ message: "Invalid audience" });
    }
    console.log("Verify Token Success!!!");

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
