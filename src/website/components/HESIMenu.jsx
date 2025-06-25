import { Menu } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
function HESIMenu() {
  return (
    <div>
      <Menu shadow="md" width={350} trigger="hover">
        <Menu.Target>
          <div className="flex justify-between items-center ">
            <p className="  px-3 py-2 text-secondary custom-hover hover:text-primary  rounded-sm ">
              HESI
            </p>
            <FaAngleDown color="#" />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          <Link to={"/hesi-practice-test-papers"}>
            <Menu.Item className="hover:text-secondary custom-hover">
              Free HESI Practice tests
            </Menu.Item>
          </Link>
          <Link to={"/hesi-practice-test-papers"}>
            <Menu.Item className="hover:text-secondary custom-hover">
              Premium HESI Test with gaurantee pass
            </Menu.Item>
          </Link>
          <Link to={"/do-my-hesi"}>
            <Menu.Item className="hover:text-secondary custom-hover">
              Do my HESI Tests
            </Menu.Item>
          </Link>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default HESIMenu;
