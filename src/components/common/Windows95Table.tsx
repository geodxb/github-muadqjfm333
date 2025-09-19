import React from 'react';

interface Column {
  key: string;
  title: string;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
}

interface Windows95TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (record: any, index: number) => void;
  selectedRowIndex?: number;
  className?: string;
}

const Windows95Table = ({
  columns,
  data,
  onRowClick,
  selectedRowIndex,
  className = ''
}: Windows95TableProps) => {
  return (
    <div className={`win95-panel-sunken ${className}`}>
      <table className="win95-table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className="win95-text"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(record, index)}
              className={`
                ${onRowClick ? 'cursor-pointer' : ''}
                ${selectedRowIndex === index ? 'win95-selected' : ''}
              `}
            >
              {columns.map((column) => (
                <td key={column.key} className="win95-text">
                  {column.render 
                    ? column.render(record[column.key], record)
                    : record[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Windows95Table;