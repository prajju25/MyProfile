import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Dimmer, Grid, Icon, Image, Loader } from "semantic-ui-react";

const Home = () => {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoader(false);
  }, []);

  if (loader) {
    return (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    );
  } else {
    return (
      <Grid>
        <Grid.Row>
          <div className="about-me">
            <p>
              <strong>A BIT ABOUT ME</strong>
            </p>
            <h1 className="about-header">Who Am I?</h1>
            <p>
              Hi I'm Prajwal Kotian a Senior Frontend/Fullstack Lead and
              Technical Specialist in frontend technologies. I am an
              enthusiastic, self-motivated and hard working person. I have an
              expereince leading the team and very flexible to work in different
              technologies. I work well under pressure and adaptable to all
              challenging situation.
            </p>
            <p>
              This website provides you my journey and my professional
              expereince details
            </p>
          </div>
        </Grid.Row>
        <Grid.Row columns={2} className="card-group">
          <Grid.Column className="card-column" width={6}>
            <div className="profile">
              <Image
                src="/DSC_1981.jpeg"
                avatar
                size="medium"
                className="profile-image"
              />
              <h2 className="profile-title">
                I am happy to show you about my professional journey
              </h2>
              <Link to="/profile">
                <Button className="profile-button">Read More</Button>
              </Link>
            </div>
          </Grid.Column>
          <Grid.Column className="card-column" width={10}>
            <Grid>
              <Grid.Row className="card-box-group">
                <Grid.Column className="card-box" width={7}>
                  <Link to="/apps" className="link">
                    <div className="pt20">
                      <Icon name="computer" size="massive" color="orange" />
                      <h2>Web Applications</h2>
                    </div>
                  </Link>
                </Grid.Column>
                <Grid.Column className="card-box" width={7}>
                  <Link to="/photography" className="link">
                    <div className="pt20">
                      <Icon name="photo" size="massive" color="purple" />
                      <h2>Photography</h2>
                    </div>
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
};
export default Home;
