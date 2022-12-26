import React, { useState } from "react";
import { Container, Grid } from "semantic-ui-react";
import Header from "./Header";
import SideMenu from "./SideMenu";

const Layout = (props: any) => {
    const [state, setState] = useState({
        displaySideMenu: false
    });    
    const menus = [
        { menuItem: 'MyProfile', to: '/' },
        { menuItem: 'Photography', to: '/photography' },
        { menuItem: 'Apps', to: '/apps' },
    ];

    const displaySideMenu = () => {
        setState({displaySideMenu: !state.displaySideMenu});
    }
    return (
        <Container>
            <Header displaySideMenu={displaySideMenu} menus={menus}/>
            <Grid>
            {state.displaySideMenu && (
                <Grid.Column width={3}>
                    <SideMenu menus={menus}/>
                </Grid.Column>)}
                <Grid.Column width={state.displaySideMenu ? 13 : 16}>
                    {props.children}
                </Grid.Column>
            </Grid>
        </Container> 
    );
}

export default Layout;