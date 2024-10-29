import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "regenerator-runtime/runtime";

const CLIENT_ID = process.env.GPHOTOS_CLIENT_ID;
const API_KEY = process.env.GPHOTOS_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly";
const GOOGLE_VERIFY_TOKEN: string | any = process.env.GOOGLE_VERIFY_TOKEN;

const Photography = () => {
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    console.log(CLIENT_ID, GOOGLE_VERIFY_TOKEN);
    // Load the Google Identity Services client
    const loadGisClient = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => initializeGis();
      document.body.appendChild(script);
    };

    // Initialize Google Identity Services
    const initializeGis = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          scope: SCOPES,
        });
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    // Handle the response from Google Identity Services
    const handleCredentialResponse = async (response: any) => {
      try {
        const decoded = jwtDecode(response.credential);
        const idToken = response.credential;

        // Exchange ID token for access token on the server (if necessary)
        const fetchedAccessToken = await fetchAccessToken(idToken);
        if (fetchedAccessToken) {
          setAccessToken(fetchedAccessToken);
          fetchPhotos(fetchedAccessToken);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    loadGisClient();
  }, []);

  // Mock function for exchanging ID token for access token
  const fetchAccessToken = async (idToken: any) => {
    try {
      const response = await fetch(GOOGLE_VERIFY_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null;
    }
  };

  // Fetch photos from Google Photos API using access token
  const fetchPhotos = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=10",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setPhotos(data.mediaItems.map((item: any) => item.baseUrl));
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  // Rotate photos every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos]);

  return (
    <div className="photography">
      {photos.length > 0 ? (
        <img
          className="photo-list"
          src={`${photos[currentIndex]}=w800-h600`}
          alt="Slideshow"
          style={{ width: "100%", maxWidth: "800px", height: "auto" }}
        />
      ) : (
        <p>Loading photos...</p>
      )}
    </div>
  );
};

export default Photography;
