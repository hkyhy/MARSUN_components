import type { FileItem as FileItemType } from '@/types';
import { getFileIcon, getFileTypeName } from '@/utils/Files';
import { formatFileSize } from '@/utils/format';
import { CloudDownload } from '@/icons';
import jsPreviewExcel, { type JsExcelPreview } from '@js-preview/excel';
import '@js-preview/excel/lib/index.css';
import { Button, Empty, Spin } from 'antd';
import { renderAsync } from 'docx-preview';
import { init as initPptxPreviewer } from 'pptx-preview';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPreviewType, resolvePreviewUrl } from '../previewUtils';
import styles from './style.module.scss';
import classNames from 'classnames';

export interface FilePreviewProps {
  /** 文件数据 */
  file: FileItemType;
  /** 预览 URL 覆盖（默认使用 /api/files/:id/download） */
  url?: string;
  /** 自定义不支持预览的提示 */
  unsupportedMessage?: string;
  /** 标题 */
  title?: React.ReactNode;
  /** 右侧额外内容 */
  extra?: React.ReactNode;
}

/** 带鉴权头的 fetch，返回 ArrayBuffer */
async function fetchWithAuth(url: string): Promise<ArrayBuffer> {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.arrayBuffer();
}

/** Excel 预览组件（使用 @js-preview/excel） */
const ExcelPreview: React.FC<{ url: string }> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<JsExcelPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = jsPreviewExcel.init(containerRef.current);
    viewerRef.current = viewer;

    viewer
      .preview(url)
      .then(() => setLoading(false))
      .catch(() => {
        setError(true);
        setLoading(false);
      });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [url]);

  if (error) return <Empty description="Excel 文件加载失败" />;

  return (
    <div className={classNames('file-preview-list', styles['file-preview-list'])}>
      {loading && (
        <div className={classNames('file-preview-empty', styles['file-preview-empty'])}>
          <Spin />
        </div>
      )}
      <div ref={containerRef} style={{ height: '70vh', overflow: 'hidden' }} />
    </div>
  );
};

/** 文本预览组件 */
const TextPreview: React.FC<{ url: string }> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchText = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const text = await res.text();
        setContent(text);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchText();
  }, [url]);

  if (loading) return <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />;
  if (error) return <Empty description="文本文件加载失败" />;

  return (
    <pre className={classNames('file-preview-content', styles['file-preview-content'])}>
      {content}
    </pre>
  );
};

/** Markdown 预览组件 */
const MarkdownPreview: React.FC<{ url: string }> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const text = await res.text();
        setContent(text);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkdown();
  }, [url]);

  if (loading) return <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />;
  if (error) return <Empty description="Markdown 文件加载失败" />;

  return (
    <div className={classNames('markdown-preview', classNames('file-preview-aside', styles['file-preview-aside']))}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

/** 图片预览组件（先 fetch 鉴权再转 blob URL） */
const ImagePreview: React.FC<{ url: string; fileName: string }> = ({ url, fileName }) => {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const objectUrlRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      try {
        const buffer = await fetchWithAuth(url);
        if (cancelled) return;
        const blob = new Blob([buffer]);
        objectUrlRef.current = URL.createObjectURL(blob);
        setBlobUrl(objectUrlRef.current);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadImage();

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = '';
      }
    };
  }, [url]);

  if (loading) return <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />;
  if (error) return <Empty description="图片加载失败" />;

  return (
    <div className={classNames('file-preview-main', styles['file-preview-main'])}>
      <img
        src={blobUrl}
        alt={fileName}
        className={classNames('file-preview-section', styles['file-preview-section'])}
      />
    </div>
  );
};

/** PDF 预览组件（先 fetch 鉴权再转 blob URL） */
const PdfPreview: React.FC<{ url: string; fileName: string }> = ({ url, fileName }) => {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const objectUrlRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;

    const loadPdf = async () => {
      try {
        const buffer = await fetchWithAuth(url);
        if (cancelled) return;
        const blob = new Blob([buffer], { type: 'application/pdf' });
        objectUrlRef.current = URL.createObjectURL(blob);
        setBlobUrl(objectUrlRef.current);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = '';
      }
    };
  }, [url]);

  if (loading) return <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />;
  if (error) return <Empty description="PDF 加载失败" />;

  return (
    <iframe
      src={blobUrl}
      title={fileName}
      className={classNames('file-preview-group', styles['file-preview-group'])}
      style={{ height: '70vh' }}
    />
  );
};

/** Word 文档预览组件（使用 docx-preview） */
const WordPreview: React.FC<{ url: string }> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    const renderDocx = async () => {
      try {
        const buffer = await fetchWithAuth(url);
        if (cancelled || !containerRef.current) return;

        await renderAsync(buffer, containerRef.current, undefined, {
          className: 'docx-preview-wrapper',
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreFonts: false,
          breakPages: true,
          ignoreLastRenderedPageBreak: true,
          experimental: false,
          trimXmlDeclaration: true,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
        });

        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderDocx();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (error) return <Empty description="Word 文档加载失败" />;

  return (
    <div className={classNames('file-preview-list', styles['file-preview-list'])}>
      {loading && <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />}
      <div
        ref={containerRef}
        className={classNames('file-preview-cell', styles['file-preview-cell'])}
        style={{ minHeight: loading ? 0 : 200 }}
      />
    </div>
  );
};

/** PPT 预览组件（使用 pptx-preview） */
const PptPreview: React.FC<{ url: string }> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ReturnType<typeof initPptxPreviewer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = initPptxPreviewer(containerRef.current, {
      width: 960,
      height: 540,
    });
    viewerRef.current = viewer;

    // 注入 CSS 覆盖库默认的黑色包装器背景
    const styleId = 'pptx-preview-override';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent =
        '.pptx-preview-wrapper { background: #fff !important; height: auto !important; }';
      document.head.appendChild(style);
    }

    let cancelled = false;

    const loadPptx = async () => {
      try {
        const buffer = await fetchWithAuth(url);
        if (cancelled) return;
        await viewer.preview(buffer);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPptx();

    return () => {
      cancelled = true;
      viewer.destroy();
      viewerRef.current = null;
    };
  }, [url]);

  if (error) return <Empty description="PPT 文件加载失败" />;

  return (
    <div className={classNames('file-preview-overlay', styles['file-preview-overlay'])}>
      {loading && <Spin className={classNames('file-preview-loading', styles['file-preview-loading'])} />}
      <div
        ref={containerRef}
        style={{ minHeight: loading ? 0 : 400, maxWidth: '100%', overflow: 'auto' }}
      />
    </div>
  );
};

/** 视频预览组件（使用带 token 的 URL 流式播放） */
const VideoPreview: React.FC<{ url: string }> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoaded = () => setLoading(false);
  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div className={classNames('file-preview-badge', styles['file-preview-badge'])}>
        <Empty description="视频加载失败" />
        <Button type="primary" icon={<CloudDownload />} href={url} target="_blank">
          下载文件
        </Button>
      </div>
    );
  }

  return (
    <div className={classNames('file-preview-tag', styles['file-preview-tag'])}>
      {loading && (
        <div className={classNames('file-preview-empty', styles['file-preview-empty'])}>
          <Spin />
        </div>
      )}
      <video
        src={url}
        controls
        className={classNames('file-preview-hint', styles['file-preview-hint'])}
        onLoadedMetadata={handleLoaded}
        onCanPlay={handleLoaded}
        onError={handleError}
      >
        您的浏览器不支持视频播放
      </video>
    </div>
  );
};

/** 不支持预览的提示组件 */
const UnsupportedPreview: React.FC<{
  file: FileItemType;
  url: string;
  message?: string;
}> = ({ file, url, message }) => (
  <div className={classNames('file-preview-badge', styles['file-preview-badge'])}>
    <div className={classNames('file-preview-sider', styles['file-preview-sider'])}>{getFileIcon(file)}</div>
    <div className={classNames('file-preview-nav', styles['file-preview-nav'])}>
      <p className={classNames('file-preview-menu', styles['file-preview-menu'])}>
        {message || `${getFileTypeName(file.extension)}暂不支持在线预览`}
      </p>
      <p className={classNames('file-preview-user-menu', styles['file-preview-user-menu'])}>
        {file.name} {file.size ? `(${formatFileSize(file.size)})` : ''}
      </p>
    </div>
    <Button type="primary" icon={<CloudDownload />} href={url} target="_blank">
      下载文件
    </Button>
  </div>
);

/** 文件预览组件：根据文件类型自动选择预览方式 */
const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  url,
  unsupportedMessage,
  title,
  extra,
}) => {
  const previewType = useMemo(() => getPreviewType(file.extension), [file.extension]);
  const previewUrl = useMemo(
    () => resolvePreviewUrl(file.id, previewType, url),
    [file.id, previewType, url],
  );

  const renderPreview = useCallback(() => {
    switch (previewType) {
      case 'image':
        return <ImagePreview url={previewUrl} fileName={file.name} />;

      case 'pdf':
        return <PdfPreview url={previewUrl} fileName={file.name} />;

      case 'video':
        return <VideoPreview url={previewUrl} />;

      case 'audio':
        return (
          <div className={classNames('file-preview-avatar', styles['file-preview-avatar'])}>
            <audio src={previewUrl} controls className={classNames('file-preview-upload', styles['file-preview-upload'])}>
              您的浏览器不支持音频播放
            </audio>
          </div>
        );

      case 'excel':
        return <ExcelPreview url={previewUrl} />;

      case 'text':
        return <TextPreview url={previewUrl} />;

      case 'markdown':
        return <MarkdownPreview url={previewUrl} />;

      case 'word':
        return <WordPreview url={previewUrl} />;

      case 'ppt':
        return <PptPreview url={previewUrl} />;

      default:
        return <UnsupportedPreview file={file} url={previewUrl} message={unsupportedMessage} />;
    }
  }, [previewType, previewUrl, file, unsupportedMessage]);

  return (
    <div className="file-preview">
      {(title || extra) && (
        <div className={classNames('file-preview-filter', styles['file-preview-filter'])}>
          <div className={classNames('file-preview-table', styles['file-preview-table'])}>{title}</div>
          <div>{extra}</div>
        </div>
      )}
      <div>{renderPreview()}</div>
    </div>
  );
};

export default FilePreview;
