import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";

const Home = () => {
    return (
        <Grid>
            <Grid.Row columns={2} className="card-group">
                <Grid.Column className="card-column">
                    <Link to='/profile'>
                        <div className="home-cards profile-bi" />
                    </Link>
                </Grid.Column>
                <Grid.Column className="card-column">
                    <Link to='/photography'>
                    <div className="home-cards camera-bi" />
                    </Link>
                </Grid.Column>
                <Grid.Column className="card-column">
                    <Link to='/apps'>
                    <div className="home-cards apps-bi" />
                    </Link>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
export default Home;