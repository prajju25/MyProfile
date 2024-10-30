const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.REACT_APP_GPHOTOS_CLIENT_ID);

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
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.REACT_APP_GPHOTOS_CLIENT_ID,
        client_secret: process.env.REACT_APP_GPHOTOS_CLIENT_SECRET,
        code: idToken,
        grant_type: "authorization_code",
        redirect_uri: process.env.REACT_APP_GOOGLE_VERIFY_TOKEN,
      }),
    });

    const data = await response.json();
    console.log("Verify Token Success!!!");

    return {
      statusCode: 200,
      body: { response: data },
    };
  } catch (error) {
    console.error("Error exchanging token:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
