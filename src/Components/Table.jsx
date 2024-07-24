import React from "react";
import { useState, useEffect } from "react";
import TableCell from "./TableCell";
import "../style/table.css";
const TableTest = ({ data }) => {
  const columns = data.filter((column) => column.place === "top");
  const rows = data.filter((row) => row.place === "left");
  const [renColumns, setRenColumns] = useState([]);
  const [renRows, setRenRows] = useState([]);

  useEffect(() => {
    const initialColumns = [
      { name: "", colSpann: getTrColCount(rows), children: [] },
      {
        name: "Setrin No",
        border: true,
        font_weight: "bold",
        font_style: "normal",
        orientation: "vertical",
        text_align: "center",
        font_size: "12",
        place: "top",
        is_sub: "0",
        children: [],
      },
      ...columns,
    ];
    setRenColumns(initialColumns);
    const updatedRows = addLevelAndDeep(rows);
    setRenRows(updatedRows);
  }, [data]);

  // Adding deep and level to object (row)
  const addLevelAndDeep = (rows) => {
    let level = 1;
    const loopRows = (row, deep) => {
      let updatedRow = { ...row, level: row.level ?? level, deep };

      if (row.children.length > 0) {
        updatedRow.children = row.children.map((child) =>
          loopRows(child, deep + 1)
        );
      } else {
        level += 1;
      }

      return updatedRow;
    };
    return rows.map((row) => loopRows(row, 1));
  };

  const getTrColCount = (col) => {
    let maxDepth = 0;
    const loopThrough = (row, depth = 1) => {
      let parentChilds = row.children.length;
      if (parentChilds > 0) {
        row.children.forEach((child) => loopThrough(child, depth + 1));
      }

      if (depth > maxDepth) {
        maxDepth = depth;
      }
    };

    col.forEach((column) => loopThrough(column));

    return maxDepth;
  };

  const getRowCol = (index, allCol, inverted) => {
    let updatedCol = allCol;
    if (inverted) {
      for (let i = index; i > index; i--) {
        updatedCol = updatedCol.map((each) => each.children).flat();
      }
    } else {
      for (let i = 0; i < index; i++) {
        updatedCol = updatedCol.map((each) => each.children).flat();
      }
    }
    return updatedCol;
  };

  const getLeafCount = (row) => {
    let arr = [];
    const loopArr = (row) => {
      let parentChilds = row.children.length;
      if (parentChilds == 0) {
        arr.push(parentChilds);
      }
      if (parentChilds > 0) {
        row.children.forEach((each) => loopArr(each));
      }
      return arr.length;
    };
    return loopArr(row);
  };

  const renderTds = (row, dat, index, each, reverse) => {
    let leafes = getLeafCount(row);
    let spanRow = row.children && getTrColCount(dat);
    let rowSpan = row.children.length > 0 ? 1 : spanRow - each;
    if (reverse) {
      rowSpan = row.children.length > 0 ? 1 : spanRow - row.deep + 1;
    }
    return (
      <TableCell
        key={index}
        colSpan={reverse ? rowSpan : leafes}
        rowSpan={reverse ? leafes : rowSpan}
        row={row}
      />
    );
  };
  const calcLeafesRow = (dat) => {
    let arr = dat.map((each) => getLeafCount(each));
    let num = 0;
    arr.forEach((each) => (num += each));
    return num;
  };

  const getTrRows = (rows, each) => {
    const result = [];

    const traverse = (node) => {
      if (node.level === each) {
        result.push(node);
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child));
      }
    };

    rows.forEach((row) => traverse(row));
    return result;
  };

  const getAllLeafes = (cols) => {
    let indx = 0;
    let arr = [];
    const loopArr = (row, i) => {
      let leng = row.children.length;
      if (leng == 0) {
        if (row.is_sub == 1) {
          indx = (indx * 10 + 1) / 10;
        } else indx = +indx.toFixed() + 1;
        arr.push({ ...row, indx: indx });
      }
      if (leng > 0) {
        row.children.forEach((each) => loopArr(each, i));
      }
      return arr;
    };
    cols.map((row, i) => loopArr(row, i));
    return arr;
  };

  return (
    <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
      <tbody>
        {Array.from(Array(getTrColCount(renColumns)).keys()).map((each) => {
          return (
            <tr key={each}>
              {getRowCol(each, renColumns, false).map((row, index) => {
                return renderTds(row, columns, index, each, false);
              })}
            </tr>
          );
        })}
        <tr>
          <th colSpan={getTrColCount(renRows)}>A</th>
          <th>B</th>
          {getAllLeafes(columns).map((leaf, index) => {
            return <th key={index}>{String(leaf.indx).replace(".", "-")}</th>;
          })}
        </tr>
        {Array.from(Array(calcLeafesRow(renRows)).keys()).map((each) => {
          return (
            <tr key={each}>
              {getTrRows(renRows, each + 1).map((row, index) =>
                renderTds(row, renRows, index, each, true)
              )}
              <th>{String(getAllLeafes(rows)[each].indx).replace(".", "-")}</th>
              {Array.from(Array(getAllLeafes(columns).length).keys()).map(
                (_, indxx) => {
                  return <td className="dotted" key={indxx}></td>;
                }
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableTest;
