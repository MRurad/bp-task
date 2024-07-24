import React from "react";
import { data } from "./Data/data";
import Table from "./Components/Table";

const App = () => {
  return (
    <div style={{ margin: "30px" }}>
      <h1>Dynamic Table</h1>
      <Table data={data} />
    </div>
  );
};

export default App;
