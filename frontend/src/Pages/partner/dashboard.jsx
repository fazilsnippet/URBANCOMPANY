import React from 'react';
import { useGetServiceProfileQuery, useToggleAvailabilityMutation, useGetBookingsQuery } from '../../features/partner/partnerApi';

export default function PartnerDashboard() {
  const { data: profile } = useGetServiceProfileQuery();
  const { data: bookings = [] } = useGetBookingsQuery();
  const [toggle] = useToggleAvailabilityMutation();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="card bg-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Service Profile</h2>
            <input type="checkbox" className="toggle toggle-primary" checked={profile?.active} onChange={(e)=>toggle(e.target.checked)} />
          </div>
          <div>Name: {profile?.name}</div>
          <div>Category: {profile?.category}</div>
          <div>Description: {profile?.description}</div>
        </div>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Bookings</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>#</th><th>User</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.map((b, i)=>(
                  <tr key={b.id}><td>{i+1}</td><td>{b.user?.name}</td><td>{new Date(b.date).toLocaleString()}</td><td>{b.status}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}