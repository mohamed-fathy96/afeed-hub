import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Table, TableHead, TableBody, TableRow, CardBody } from "@app/ui";
import { Icon } from "../Icon";

export interface Column {
  id: string;
  title: string;
  render?: (row: any) => React.ReactNode;
}

export interface ReorderableTableProps {
  columns: Column[];
  data: any[];
  onRowReorder?: (newData: any[]) => void;
}

const DraggableRow: React.FC<{
  row: any;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  columns: Column[];
}> = ({ row, index, moveRow, columns }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ROW",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "ROW",
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        moveRow(item.index, index);
      }
    },
  });

  return (
    <TableRow
      ref={(node) => drag(drop(node as any)) as any}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        userSelect: "none",
      }}
    >
      {columns.map((column) => (
        <td key={column.id}>
          {column.render ? column.render(row) : row[column.id]}
        </td>
      ))}
    </TableRow>
  );
};

const ReorderableTable: React.FC<ReorderableTableProps> = ({
  columns,
  data: initialData,
  onRowReorder,
}) => {
  const [data, setData] = useState(initialData);

  // Update internal state when prop changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const newData = [...data];
    const draggedRow = newData[dragIndex];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, draggedRow);
    setData(newData);
    onRowReorder?.(newData);
  };

  return (
    <>
      {data?.length === 0 ? (
        <div className="w-full">
          <CardBody className="p-6 w-full">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Icon
                  icon="lucide:file-text"
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                />
                <p className="text-gray-600">No data found</p>
              </div>
            </div>
          </CardBody>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Table>
            <TableHead>
              {columns.map((column) => (
                <th key={column.id}>{column.title}</th>
              ))}
            </TableHead>
            <TableBody>
              {data?.map((row, index) => (
                <DraggableRow
                  key={index}
                  row={row}
                  index={index}
                  moveRow={moveRow}
                  columns={columns}
                />
              ))}
            </TableBody>
          </Table>
        </DndProvider>
      )}
    </>
  );
};

export default ReorderableTable;
