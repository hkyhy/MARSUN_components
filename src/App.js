import { HashRouter } from 'react-router-dom';
import readme from 'readme';
import DocsRoutes from './docs/DocsRoutes';

const App = ({ theme, ...props }) => (
  <HashRouter>
    <DocsRoutes
      {...props}
      theme={theme}
      paths={[
        {
          key: 'components',
          path: '/',
          title: '组件',
        },
      ]}
      readme={readme}
    />
  </HashRouter>
);

export default App;
