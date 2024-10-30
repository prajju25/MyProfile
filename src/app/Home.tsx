import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Icon, Image } from "semantic-ui-react";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid className="home-page">
      <Grid.Row className="home-section">
        <div className="about-me">
          <p>
            <strong className="sub-header">A BIT ABOUT ME</strong>
          </p>
          <h1 className="about-header">Who Am I?</h1>
          <p>
            Hello! I'm Prajwal Kotian - Senior Frontend/Fullstack Lead by
            profession, digital explorer by choice. When I'm not orchestrating
            the perfect blend of JavaScript and caffeine, I'm busy transforming
            complex tech into user-friendly magic. I've led teams across
            code-filled battlefields and tackled challenges in every corner of
            the tech stack.
          </p>
          <p>
            Here, you'll find the highlights of my journey: career milestones,
            lessons learned, and maybe a few coding bloopers (hey, nobody's
            perfect!). Dive in and see where the pixels and persistence have
            taken me so far!
          </p>
        </div>
      </Grid.Row>
      <Grid.Row columns={2} className="home-section card-group">
        <Grid.Column className="card-column" width={6}>
          <Link to="/profile">
            <div className="profile">
              <Image
                src="/DSC_1981.jpeg"
                avatar
                size="medium"
                className="profile-image"
              />
              <h2 className="profile-title">
                I am happy to show you about my <br />
                professional journey
              </h2>
              <Button className="profile-button">Read More</Button>
            </div>
          </Link>
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
};
export default Home;
