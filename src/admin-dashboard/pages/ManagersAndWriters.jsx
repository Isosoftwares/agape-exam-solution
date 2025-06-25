import { Modal, Tabs } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Managers from "../components/Managers";
import Writers from "../components/Writers";
import { useDisclosure } from "@mantine/hooks";
import AddUser from "../components/AddUser";

function ManagersAndWriters() {
  const [opened, { open: openAddUser, close: closeAdduser }] = useDisclosure(
    false
  );

  return (
    <div>
      {" "}
      {/* Reassign writer modal */}
      <Modal opened={opened} onClose={closeAdduser} title="Register user">
        <AddUser handleAddUserForm={closeAdduser} />
      </Modal>
      <div className="flex justify-between my-3 bg-light p-2 ">
        <p className="font-bold ">Managers & Writers</p>
        <button
          onClick={() => {
            openAddUser();
          }}
          className="bg-primary disabled:cursor-not-allowed disabled:bg-gray-700 text-light px-4 rounded-md  "
        >
          Register User
        </button>
      </div>
      {/* table */}
      <div className="relative overflow-x-auto sm:rounded-lg  py-5 bg-white px-2 ">
        {/*  */}
        <Tabs defaultValue="managers">
          <Tabs.List grow className="bg-gray-50">
            <Tabs.Tab value="managers">Managers</Tabs.Tab>
            <Tabs.Tab value="writers">Writers</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="managers">
            <Managers />
          </Tabs.Panel>

          <Tabs.Panel value="writers">
            <Writers />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default ManagersAndWriters;
