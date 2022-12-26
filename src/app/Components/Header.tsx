import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

const Header = ({displaySideMenu, menus}:any) => {
    return (
        <Menu style={{ marginTop: '10px'}}>
            <a className='item' onClick={displaySideMenu}>
                <Icon disabled name='th' />
            </a>
            <Menu.Menu position='right'>
                {menus.map((m: { menuItem: string, to: string }, k: number)=>{
                    return (
                        <Link to={m.to} className='item'
                        key={m.menuItem+k}>{m.menuItem}</Link>
                    );
                })}
            </Menu.Menu>
        </Menu>
    );
}

export default Header;