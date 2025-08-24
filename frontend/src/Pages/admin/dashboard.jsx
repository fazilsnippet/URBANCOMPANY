
import React from 'react';
import { useGetUsersQuery, useToggleUserMutation, useGetRevenueQuery } from '../../features/admin/adminApi';

export default function AdminDashboard() {
  const { data: users = [] } = useGetUsersQuery();
  const { data: revenue = { total: 0, month: 0 } } = useGetRevenueQuery();
  const [toggle] = useToggleUserMutation();

  return (
    <div className="p-6 space-y-6">
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value">₹{(revenue.total || 0).toLocaleString()}</div>
          <div className="stat-desc">All time</div>
        </div>
        <div className="stat">
          <div className="stat-title">This Month</div>
          <div className="stat-value">₹{(revenue.month || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {users.map((u)=>(
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.banned ? 'Banned' : 'Active'}</td>
                    <td><input type="checkbox" className="toggle" checked={u.banned} onChange={(e)=>toggle({ id: u.id, banned: e.target.checked })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
