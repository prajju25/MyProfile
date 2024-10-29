import React, { useEffect, useState } from "react";
import { fetchJson } from "../../Components/ApiCalls";
import * as ApiConstants from "../../Constants/ApiConstant";
import { Dimmer, Loader, Message } from "semantic-ui-react";
import { AppsObject } from "../../Interface/AppsObject";
import Carousel from "react-bootstrap/esm/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

const Apps = () => {
  const [appData, setAppData] = useState<Array<AppsObject>>();
  const [settings, setSettings] = useState({
    loader: true,
    error: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJson(ApiConstants.APPS_DATA_JSON)
      .then((res: any) => {
        setAppData(res);
        setSettings({ ...settings, loader: false, error: false });
      })
      .catch((err: any) => {
        setSettings({ ...settings, loader: false, error: true });
      });
  }, []);

  const caraouselDisplay = () => (
    <>
      <div className="app-name">Applications</div>
      <Carousel className="full-screen-carousel">
        {appData?.map((app) => (
          <Carousel.Item
            key={app.name}
            onClick={() => {
              window.open(app.url, "_blank1;");
            }}
          >
            <div
              className="image-overlay-container"
              style={{ backgroundImage: `url(${app.imageUrl})` }}
            />
            <Carousel.Caption className="carousel-section">
              <h1>{app.name}</h1>
              <p className="carousel-desc">{app.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );

  const appDisplay = () =>
    settings.error ? (
      <Message
        error
        header="Failed to fetch Applications Data!! Please try after some time."
      />
    ) : (
      caraouselDisplay()
    );

  return (
    <div className="main-page app-col">
      {settings.loader ? (
        <Dimmer active inverted>
          <Loader inverted content="Loading" />
        </Dimmer>
      ) : (
        appDisplay()
      )}
    </div>
  );
};

export default Apps;
