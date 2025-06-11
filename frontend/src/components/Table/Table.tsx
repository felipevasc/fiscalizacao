import React from 'react';
import './Table.css';

interface TableColumn {
  accessor: string; // Changed from key to accessor
  header: string;
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  title: string;
  columns: TableColumn[];
  data: TableRow[];
  isLoading?: boolean;
  isError?: boolean;
}

const Table: React.FC<TableProps> = ({ title, columns, data, isLoading, isError }) => {
  return (
    <div className="card br-table">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-tools">
          <div className="input-group input-group-sm" style={{ width: '150px' }}>
            <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
            <div className="input-group-append">
              <button type="submit" className="btn btn-default">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading data.</p>}
        {!isLoading && !isError && (
          <table className="table table-hover text-nowrap">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor}>{col.header}</th> // Changed from col.key to col.accessor
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col.accessor}>{row[col.accessor]}</td> // Changed from col.key to col.accessor
                  ))}
                  <td>
                    <button className="btn btn-sm btn-info mr-2" data-toggle="modal" data-target={`#viewModal-${rowIndex}`}>
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button className="btn btn-sm btn-warning mr-2" data-toggle="modal" data-target={`#editModal-${rowIndex}`}>
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button className="btn btn-sm btn-danger" data-toggle="modal" data-target={`#deleteModal-${rowIndex}`}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="card-footer clearfix">
        <ul className="pagination pagination-sm m-0 float-right">
          <li className="page-item"><a className="page-link" href="#">&laquo;</a></li>
          <li className="page-item"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item"><a className="page-link" href="#">&raquo;</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Table;
