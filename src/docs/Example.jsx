import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import ensureSlash from './ensureSlash';
import ExamplePage from './ExamplePage';

const Example = ({ baseUrl, readme, theme, pageProps }) => {
  const { id: current } = useParams();
  const [searchParams] = useSearchParams();
  const searchString = searchParams.size > 0 ? `?${searchParams.toString()}` : '';

  if (!(current && readme[current])) {
    const firstKey = Object.keys(readme)[0];
    return (
      <Navigate
        to={`${ensureSlash(baseUrl, true)}${firstKey}${searchString}`}
        replace
      />
    );
  }

  const data = readme[current];

  return (
    <ExamplePage
      pageProps={pageProps}
      data={data}
      current={current}
      theme={theme}
      items={Object.keys(readme).map((name) => ({
        label: name,
        key: name,
        path: `${ensureSlash(baseUrl, true)}${name}${searchString}`,
      }))}
    />
  );
};

export default Example;
