import React from "react";

const TableCell = ({ colSpan, rowSpan, row }) => {
  const styles = {
    fontWeight: row.font_weight,
    fontStyle: row.font_style,
    textAlign: row.text_align,
    fontSize: `${row.font_size}px`,
    border: row.border ? "3px solid black" : "1px solid black",
  };

  const verticalStyles = {
    transform: "rotate(-90deg)",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    height: "90px",
  };

  return (
    <td
      rowSpan={rowSpan}
      colSpan={row.colSpann ? String(row.colSpann) : String(colSpan)}
      style={
        row.orientation === "vertical"
          ? { ...styles, ...verticalStyles }
          : styles
      }
    >
      {row.name}
    </td>
  );
};

export default TableCell;
