import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';
import 'highlight.js/styles/github.css';

hljs.configure({ ignoreUnescapedHTML: true });

const wrapTableElements = (htmlString) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  tempDiv.querySelectorAll('table').forEach((table) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-content';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
  return tempDiv.innerHTML;
};

const Highlight = ({ html, className, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });
  }, [html]);

  return (
    <div
      {...props}
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: wrapTableElements(html) }}
    />
  );
};

export default Highlight;
