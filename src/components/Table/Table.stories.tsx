import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Table, TableColumn } from './Table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  createdAt: Date;
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: new Date('2023-09-15T10:30:00'),
    createdAt: new Date('2023-01-15')
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: new Date('2023-09-14T14:20:00'),
    createdAt: new Date('2023-02-20')
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'Viewer',
    status: 'inactive',
    lastLogin: new Date('2023-08-30T09:15:00'),
    createdAt: new Date('2023-03-10')
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    role: 'Editor',
    status: 'active',
    lastLogin: new Date('2023-09-10T16:45:00'),
    createdAt: new Date('2023-04-05')
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    role: 'Viewer',
    status: 'pending',
    lastLogin: new Date('2023-09-01T11:10:00'),
    createdAt: new Date('2023-05-15')
  },
  {
    id: 6,
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: new Date('2023-09-13T08:30:00'),
    createdAt: new Date('2023-06-22')
  }
];

// Define columns for the table
const columns: TableColumn<User>[] = [
  {
    id: 'id',
    header: 'ID',
    accessor: 'id',
    width: '70px',
    align: 'right'
  },
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    sortable: true
  },
  {
    id: 'email',
    header: 'Email',
    accessor: 'email',
    sortable: true
  },
  {
    id: 'role',
    header: 'Role',
    accessor: 'role',
    sortable: true,
    align: 'center'
  },
  {
    id: 'status',
    header: 'Status',
    accessor: 'status',
    sortable: true,
    align: 'center',
    cell: (value, row) => {
      const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      };
      
      return (
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status]}`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      );
    }
  },
  {
    id: 'lastLogin',
    header: 'Last Login',
    accessor: 'lastLogin',
    sortable: true,
    cell: (value) => {
      const date = value as Date;
      return date.toLocaleString();
    }
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessor: 'createdAt',
    sortable: true,
    cell: (value) => {
      const date = value as Date;
      return date.toLocaleDateString();
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    accessor: () => null,
    sortable: false,
    align: 'center',
    cell: (_, row) => (
      <div className="flex justify-center gap-2">
        <button 
          className="p-1 text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.stopPropagation();
            alert(`View user ${row.name}`);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button 
          className="p-1 text-green-600 hover:text-green-800"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Edit user ${row.name}`);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          className="p-1 text-red-600 hover:text-red-800"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Delete user ${row.name}`);
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    )
  }
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    data: users,
    columns: columns,
  },
};

export const Striped: Story = {
  args: {
    data: users,
    columns: columns,
    striped: true,
  },
};

export const Bordered: Story = {
  args: {
    data: users,
    columns: columns,
    bordered: true,
  },
};

export const StripedAndBordered: Story = {
  args: {
    data: users,
    columns: columns,
    striped: true,
    bordered: true,
  },
};

export const Hoverable: Story = {
  args: {
    data: users,
    columns: columns,
    hover: true,
  },
};

export const NonHoverable: Story = {
  args: {
    data: users,
    columns: columns,
    hover: false,
  },
};

export const StickyHeader: Story = {
  args: {
    data: users.concat(users, users), // Repeat data to demonstrate scrolling
    columns: columns,
    stickyHeader: true,
    maxHeight: '300px',
  },
};

export const WithSorting: Story = {
  args: {
    data: users,
    columns: columns,
    sortable: true,
    defaultSortColumn: 'name',
    defaultSortDirection: 'asc',
  },
};

export const WithPagination: Story = {
  args: {
    data: users.concat(users, users, users), // Repeat data to demonstrate pagination
    columns: columns,
    pagination: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 20],
  },
};

export const WithSortingAndPagination: Story = {
  args: {
    data: users.concat(users, users), // Repeat data to demonstrate pagination
    columns: columns,
    sortable: true,
    defaultSortColumn: 'name',
    defaultSortDirection: 'asc',
    pagination: true,
    pageSize: 5,
  },
};

export const SizeSmall: Story = {
  args: {
    data: users,
    columns: columns,
    size: 'sm',
  },
};

export const SizeMedium: Story = {
  args: {
    data: users,
    columns: columns,
    size: 'md',
  },
};

export const SizeLarge: Story = {
  args: {
    data: users,
    columns: columns,
    size: 'lg',
  },
};

export const VariantPrimary: Story = {
  args: {
    data: users,
    columns: columns,
    variant: 'primary',
  },
};

export const VariantMinimal: Story = {
  args: {
    data: users,
    columns: columns,
    variant: 'minimal',
  },
};

export const Loading: Story = {
  args: {
    data: [],
    columns: columns,
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    columns: columns,
    emptyMessage: 'No users found',
  },
};

export const WithRowClick: Story = {
  args: {
    data: users,
    columns: columns,
    onRowClick: (row) => alert(`Row clicked: ${row.name}`),
  },
};

export const CustomEmptyState: Story = {
  args: {
    data: [],
    columns: columns,
    renderEmpty: () => (
      <tr>
        <td colSpan={columns.length} className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add new user
            </button>
          </div>
        </td>
      </tr>
    ),
  },
}; 