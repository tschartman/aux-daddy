import React from "react";
import styled from "styled-components";

const UsersPanel = ({ visible, togglePanel, users, host }) => {

  return (
    <Panel visible={visible}>
      <button
       onClick={togglePanel}
       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        <i className="fas fa-arrow-right"></i>
      </button>
      <h2 className="text-xl font-bold mb-2 pt-4 pl-6">Users in the room:</h2> {/* Add padding */}
      <ul>
        {users.map((user, index) => (
          <li key={index} className="mb-1">
            <h1 className="text-2xl font-bold m-4 text-stone-800">{user.name} -  {user.id === host.id ? "Host" : "Guest"}</h1>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background-color: #fff;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  overflow-y: auto;
  z-index: 1000;
  transform: ${({ visible }) =>
    visible ? "translateX(0)" : "translateX(100%)"};
  transition: transform 0.3s ease;
`;

export default UsersPanel;