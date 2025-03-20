import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

const PaginationDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={10}
      onPageChange={setCurrentPage}
    />
  );
};

export const Basic: Story = {
  render: () => <PaginationDemo />,
};

export const DifferentSizes: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-medium mb-2">Small</h3>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="sm"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Medium</h3>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="md"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">Large</h3>
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
            size="lg"
          />
        </div>
      </div>
    );
  },
};

export const WithoutFirstLast: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        showFirstLast={false}
      />
    );
  },
};

export const WithoutPrevNext: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        showPrevNext={false}
      />
    );
  },
};

export const CustomPageRange: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
        pageRange={3}
      />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={100}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const CustomStyles: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        className="bg-gray-100 p-4 rounded-lg"
      />
    );
  },
};

export const WithEllipsis: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(5);
    return (
      <Pagination
        currentPage={currentPage}
        totalPages={20}
        onPageChange={setCurrentPage}
        pageRange={1}
      />
    );
  },
}; 