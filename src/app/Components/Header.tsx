import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

const Header = ({displaySideMenu, isSidebar}:any) => {
    return (
        <Menu style={{ marginTop: '10px'}} className="container-bg">
            <a className='item' onClick={()=>displaySideMenu(!isSidebar)}>
                <Icon disabled name='th' />
            </a>
            <Menu.Menu position='right'>
                <div className='item'>
                    Contact:
                </div>
                <div className='item'>
                    <a href='https://twitter.com/prajju2511'>
                        <Icon circular inverted name="twitter" color='blue'/>
                    </a>
                </div>
                <div className='item'>
                    <a href='https://www.facebook.com/prajwal.kotian'>
                        <Icon circular inverted name="facebook" color='blue'/>
                    </a>
                </div>
                <div className='item'>
                    <a href='https://www.linkedin.com/in/prajwal-kotian-4ba48980/'>
                        <Icon circular inverted name="linkedin" color='blue'/>
                    </a>
                </div>
                <div className='item'>
                    <a href='https://www.instagram.com/prajju25/'>
                        <img height={25}
                        src="https://s.yimg.com/fz/api/res/1.2/7wmcqjtgVFiMeMxLOlW3sw--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI0MDtxPTgwO3c9MjQw/https://s.yimg.com/zb/imgv1/e9d6381f-6a16-39d9-b6f9-1467838c022c/t_500x300" />
                    </a>
                </div>
            </Menu.Menu>
        </Menu>
    );
}

export default Header;