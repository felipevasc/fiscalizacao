import React from 'react';
import './Table.css';

interface TableColumn {
  accessor: string; // Changed from key to accessor
  header: string;
}

interface TableRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  isLoading?: boolean;
  isError?: boolean;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  isLoading,
  isError,
}) => {
  return (
    <div className='br-table'>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data.</p>}
      {!isLoading && !isError && (
        <table className='table table-hover text-nowrap'>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.accessor}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
