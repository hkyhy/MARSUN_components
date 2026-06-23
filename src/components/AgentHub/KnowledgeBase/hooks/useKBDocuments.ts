/* eslint-disable @typescript-eslint/no-explicit-any */
import { agentHubApi } from '@/api';
import type { KBDocument } from '@/types';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';

export const useKBDocuments = (datasetId: string) => {
  const [data, setData] = useState<KBDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [keyword, setKeyword] = useState('');

  const fetchData = useCallback(async () => {
    if (!datasetId) return;
    setLoading(true);
    try {
      const res = (await agentHubApi.listDocuments(datasetId, {
        page,
        pageSize,
        ...(keyword ? { keyword } : {}),
      })) as any;
      // documents: { code, data: { docs: [...], total } }
      const list: KBDocument[] = res?.data?.docs ?? res?.data?.list ?? (Array.isArray(res?.data) ? res.data : []);
      setData(Array.isArray(list) ? list : []);
      setTotal(res?.data?.total ?? list.length);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [datasetId, page, pageSize, keyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPageChange = useCallback((p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
  }, []);

  const parseDocument = useCallback(
    async (doc: KBDocument) => {
      await agentHubApi.parseDocuments(datasetId, [doc.id]);
      message.success(`「${doc.name}」已提交解析`);
      fetchData();
    },
    [datasetId, fetchData],
  );

  const stopParsing = useCallback(
    async (doc: KBDocument) => {
      await agentHubApi.stopParsing(datasetId, [doc.id]);
      message.success('已停止解析');
      fetchData();
    },
    [datasetId, fetchData],
  );

  const deleteDocument = useCallback(
    async (doc: KBDocument) => {
      await agentHubApi.deleteDocument(datasetId, doc.id);
      message.success(`「${doc.name}」已删除`);
      fetchData();
    },
    [datasetId, fetchData],
  );

  const uploadAndParse = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = (await agentHubApi.uploadDocument(datasetId, formData)) as any;
      const docId = res?.data?.id ?? res?.data?.[0]?.id;
      if (docId) {
        await agentHubApi.parseDocuments(datasetId, [docId]);
      }
      message.success(`「${file.name}」上传成功，已开始解析`);
      fetchData();
    },
    [datasetId, fetchData],
  );

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    keyword,
    setKeyword,
    fetchData,
    onPageChange,
    parseDocument,
    stopParsing,
    deleteDocument,
    uploadAndParse,
  };
};
