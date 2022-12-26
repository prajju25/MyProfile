import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = ({menus}: any) => {

    const [state, setState] = useState('');

    const activeMenu = (name: string) => {
        setState(name);
    }

    return (
        <Menu vertical>
            {menus.map((m: { menuItem: string, to: string },k:number)=>{
                return (
                    <Menu.Item
                      name={m.menuItem}
                      active={state === m.menuItem}
                      onClick={()=>activeMenu(m.menuItem)}
                      key={m.menuItem+k}
                    >
                        <Link to={m.to}>{m.menuItem}</Link>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
}

export default SideMenu;