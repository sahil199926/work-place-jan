import Nav from './Nav'
import {UserProvider} from './context/userContext';
import 'react-notifications-component/dist/theme.css'

import { ReactNotifications } from 'react-notifications-component'

function App() {
  return (
    <div className="App">
      <UserProvider>
      <ReactNotifications />
      <Nav/>
      </UserProvider>
    </div>
  );
}

export default App;
