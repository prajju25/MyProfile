import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb, Container, Grid, Menu, Segment, Sidebar } from "semantic-ui-react";
import Header from "./Header";
import SideMenu from "./SideMenu";

const Layout = (props: any) => {
    const location = useLocation();
    let isActive = ['/profile','/photography','/apps'].includes(location.pathname);
    const [state, setState] = useState({
        displaySideMenu: false
    });    
    const menus = [
        { menuItem: 'Home', to: '/', name: 'home' },
        { menuItem: 'MyProfile', to: '/profile', name: 'address card outline' },
        { menuItem: 'Photography', to: '/photography', name: 'camera' },
        { menuItem: 'Apps', to: '/apps', name: 'globe' },
    ];

    const displaySideMenu = (value: boolean) => {
        setState({displaySideMenu: value});
    }
    return (
        <Container>
            <Header displaySideMenu={displaySideMenu} menus={menus} isSidebar={state.displaySideMenu}/>
            <Grid>
                <Grid.Row className="breadcrumbs-row">
                    <Grid.Column className="container-bg breadcrumbs">
                        <Breadcrumb>
                            <Breadcrumb.Section href='/' link={isActive} active={!isActive}>Home</Breadcrumb.Section>
                            {isActive && (<>
                            <Breadcrumb.Divider />
                            <Breadcrumb.Section active>{menus.find(m=>m.to == location.pathname)?.menuItem}</Breadcrumb.Section>
                            </>)}
                        </Breadcrumb>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Sidebar.Pushable as={Segment}>
                            <Sidebar
                                as={Menu}
                                animation='overlay'
                                icon='labeled'
                                inverted
                                onHide={() => displaySideMenu(false)}
                                vertical
                                visible={state.displaySideMenu}
                                width='thin'
                            >
                                <SideMenu menus={menus}/>
                            </Sidebar>
                            <Sidebar.Pusher dimmed={state.displaySideMenu} className="container-bg">
                                <Segment basic>
                                        {props.children}
                                </Segment>
                            </Sidebar.Pusher>
                        </Sidebar.Pushable>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container> 
    );
}

export default Layout;