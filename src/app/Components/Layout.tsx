import React, { useState } from "react";
import { Container, Grid, Menu, Segment, Sidebar } from "semantic-ui-react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import { menus } from "../Constants/Constants";

const Layout = (props: any) => {
  const [state, setState] = useState({
    displaySideMenu: false,
  });

  const displaySideMenu = (value: boolean) => {
    setState({ displaySideMenu: value });
  };
  return (
    <Container fluid={true}>
      <Header
        displaySideMenu={displaySideMenu}
        isSidebar={state.displaySideMenu}
      />
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Sidebar.Pushable as={Segment}>
              <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                onHide={() => displaySideMenu(false)}
                vertical
                visible={state.displaySideMenu}
                width="thin"
              >
                <SideMenu menus={menus} toogleSideBar={displaySideMenu} />
              </Sidebar>
              <Sidebar.Pusher
                dimmed={state.displaySideMenu}
                className="container-bg"
              >
                <Segment basic>{props.children}</Segment>
              </Sidebar.Pusher>
            </Sidebar.Pushable>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Layout;
