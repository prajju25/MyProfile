import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon, Menu, SemanticICONS } from "semantic-ui-react";

const SideMenu = ({ menus, toogleSideBar }: any) => {
  const navigate = useNavigate();

  return (
    <>
      {menus.map(
        (
          m: { menuItem: string; to: string; name: SemanticICONS },
          k: number
        ) => {
          return (
            <Menu.Item
              as="a"
              name={m.menuItem}
              onClick={() => {
                toogleSideBar(false);
                navigate(m.to);
              }}
              key={m.menuItem + k}
            >
              <Icon name={m.name} />
              {m.menuItem}
            </Menu.Item>
          );
        }
      )}
    </>
  );
};

export default SideMenu;
