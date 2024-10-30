const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.REACT_APP_GPHOTOS_CLIENT_ID);
const axios = require("axios");

exports.handler = async (event, context) => {
  const { idToken } = JSON.parse(event.body);
  console.log("Verify Token Request:", idToken);

  if (!idToken) {
    console.log("Verify Token: Error:Access token is required");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Access token is required" }),
    };
  }
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.REACT_APP_GPHOTOS_CLIENT_ID,
      client_secret: process.env.REACT_APP_GPHOTOS_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: idToken,
      redirect_uri: process.env.REACT_APP_GOOGLE_VERIFY_TOKEN,
    });
    console.log("Verify Token Success!!!");

    return {
      statusCode: 200,
      body: { accessToken: response.data.access_token },
    };
  } catch (error) {
    console.error("Error exchanging token:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
