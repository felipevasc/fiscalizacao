import { render, screen } from '@testing-library/react';
import Table from './Table'; // Adjust path as necessary
import '@testing-library/jest-dom';

describe('Table component', () => {
  const mockColumns = [
    { header: 'Column 1', accessor: 'col1' },
    { header: 'Column 2', accessor: 'col2' },
  ];
  const mockData = [
    { col1: 'Row 1 Col 1', col2: 'Row 1 Col 2' },
    { col1: 'Row 2 Col 1', col2: 'Row 2 Col 2' },
  ];

  it('renders the table with title, headers, and data', () => {
    render(<Table title="Test Table" columns={mockColumns} data={mockData} />);

    // Check for title
    expect(screen.getByText('Test Table')).toBeInTheDocument();

    // Check for column headers
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();

    // Check for data
    expect(screen.getByText('Row 1 Col 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 2')).toBeInTheDocument();
  });

  it('renders without crashing if no data is provided', () => {
    render(<Table title="Test Table Empty" columns={mockColumns} data={[]} />);
    expect(screen.getByText('Test Table Empty')).toBeInTheDocument();
    // Expect table body to be empty or show a "no data" message if implemented
    // For now, just check that it doesn't crash and title is there.
  });
});
