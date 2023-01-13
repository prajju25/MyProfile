import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

const SideMenu = ({menus}: any) => {    
    const navigate = useNavigate();

    return (
        <>
            {menus.map((m: { menuItem: string, to: string, name: string },k:number)=>{
                return (
                    <Menu.Item
                      as='a'
                      name={m.menuItem}
                      onClick={()=>navigate(m.to)}
                      key={m.menuItem+k}
                    >
                        <Icon name={m.name}/>{m.menuItem}
                    </Menu.Item>
                );
            })}
        </>
    );
}

export default SideMenu;