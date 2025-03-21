import React from 'react';
import { Typography } from './Typography';
import { Tag } from './Tag';
import { Chip } from './Chip';

/**
 * Example component demonstrating the use of Typography across a UI
 */
export const TypographyExamples: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <header className="mb-8">
        <Typography variant="display2" color="primary">
          Project Dashboard
        </Typography>
        <Typography variant="headline3" color="subtle">
          Overview of all active projects and tasks
        </Typography>
      </header>

      {/* Main content */}
      <main className="space-y-8">
        {/* Project section */}
        <section className="space-y-4">
          <Typography variant="headline1">
            Active Projects
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Card */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="title1">
                  Website Redesign
                </Typography>
                <Tag text="In Progress" color="warning" />
              </div>
              
              <Typography variant="body1" className="mb-3">
                Redesign of the company website with new branding and improved user experience.
              </Typography>
              
              <div className="flex gap-2 mb-4">
                <Chip label="UI/UX" size="sm" color="primary" />
                <Chip label="Frontend" size="sm" color="secondary" />
                <Chip label="High Priority" size="sm" color="danger" />
              </div>
              
              <div className="border-t pt-3">
                <Typography variant="label1" color="subtle">
                  Due date: March 15, 2023
                </Typography>
              </div>
            </div>
            
            {/* Project Card */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="title1">
                  Mobile App Development
                </Typography>
                <Tag text="Planning" color="info" />
              </div>
              
              <Typography variant="body1" className="mb-3">
                Creating a new mobile application with React Native for both iOS and Android platforms.
              </Typography>
              
              <div className="flex gap-2 mb-4">
                <Chip label="Mobile" size="sm" color="primary" />
                <Chip label="React Native" size="sm" color="secondary" />
                <Chip label="API Integration" size="sm" color="info" />
              </div>
              
              <div className="border-t pt-3">
                <Typography variant="label1" color="subtle">
                  Due date: June 30, 2023
                </Typography>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tasks section */}
        <section className="space-y-4">
          <Typography variant="headline2">
            Recent Tasks
          </Typography>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <Typography variant="label1" color="subtle">
                      Task Name
                    </Typography>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Typography variant="label1" color="subtle">
                      Project
                    </Typography>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Typography variant="label1" color="subtle">
                      Status
                    </Typography>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <Typography variant="label1" color="subtle">
                      Due Date
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Create wireframes for homepage
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Website Redesign
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Tag text="Completed" color="success" size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Mar 5, 2023
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Design system implementation
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Website Redesign
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Tag text="In Progress" color="warning" size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Mar 10, 2023
                    </Typography>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      API requirements documentation
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Mobile App Development
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    <Tag text="Pending" color="info" size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="body2">
                      Mar 15, 2023
                    </Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Analytics section */}
        <section className="space-y-4">
          <Typography variant="headline2">
            Project Analytics
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <Typography variant="label1" color="subtle">
                Tasks Completed
              </Typography>
              <Typography variant="display1" color="success">
                24
              </Typography>
              <Typography variant="body2" color="subtle">
                +8% from last week
              </Typography>
            </div>
            
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <Typography variant="label1" color="subtle">
                Tasks In Progress
              </Typography>
              <Typography variant="display1" color="warning">
                12
              </Typography>
              <Typography variant="body2" color="subtle">
                -2% from last week
              </Typography>
            </div>
            
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <Typography variant="label1" color="subtle">
                Project Completion
              </Typography>
              <Typography variant="display1" color="primary">
                68%
              </Typography>
              <Typography variant="body2" color="subtle">
                +5% from last week
              </Typography>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="mt-12 pt-6 border-t">
        <Typography variant="body2" color="subtle" align="center">
          &copy; 2023 Company Name. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default TypographyExamples; 