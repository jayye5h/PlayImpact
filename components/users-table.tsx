'use client'

export type AdminUserRow = {
  id: string
  name: string | null
  email: string
  plan_type: string | null
  is_active: boolean
  expiry_date: string | null
  created_at: string
}

export default function UsersTable({ users = [] }: { users?: AdminUserRow[] }) {
  return (
    <div className="glass rounded-2xl p-4 border border-[#00D1FF]/30 overflow-hidden sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#00D1FF]/30">
              <th className="text-left py-4 px-4 text-[#A0A0A8] font-semibold">Name</th>
              <th className="text-left py-4 px-4 text-[#A0A0A8] font-semibold">Email</th>
              <th className="text-left py-4 px-4 text-[#A0A0A8] font-semibold">Plan</th>
              <th className="text-left py-4 px-4 text-[#A0A0A8] font-semibold">Joined</th>
              <th className="text-left py-4 px-4 text-[#A0A0A8] font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#00D1FF]/10 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4 text-[#E5E7EB] font-medium">{user.name || '—'}</td>
                <td className="py-4 px-4 text-[#A0A0A8]">{user.email}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(user.plan_type || '').includes('premium')
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      : 'bg-[#00D1FF]/20 text-[#00D1FF]'
                    }`}>
                    {user.plan_type || 'none'}
                  </span>
                </td>
                <td className="py-4 px-4 text-[#A0A0A8]">{user.created_at.slice(0, 10)}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                    }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[#A0A0A8]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
