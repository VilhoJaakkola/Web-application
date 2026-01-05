import { useQuery } from '@tanstack/react-query';

import { trpc } from '../utils/trpc';

export default function UserList() {
  const { data: users, isLoading, error } = useQuery(trpc.users.getAll.queryOptions());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
