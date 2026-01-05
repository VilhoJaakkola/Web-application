import { QueryClientProvider } from '@tanstack/react-query';

import UserList from './components/user-list';
import { queryClient } from './utils/trpc';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  );
}

export default App;
