import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/trpc'
import UserList from './components/user-list'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  )
}

export default App
