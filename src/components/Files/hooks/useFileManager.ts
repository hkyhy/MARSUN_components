import { fileApi } from '@/api';
import {
  canShowFileDeptFilter,
  canShowFileUploaderFilter,
  FILE_LIST_SORT_DEFAULT,
  toFileListSortParams,
  type FileListSortState,
} from '@/components/Files/constants';
import { FILE_EXISTENCE_FILTER_DEFAULT, type FileExistenceStatus } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { FileItem } from '@/types';
import { UserRole } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  canOperate as checkCanOperate,
  handleMoveSubmit,
  handleRenameSubmit,
} from '../Action/handlers';
import type { BreadcrumbItem } from '../List/FilterBar';

/** 文件管理页面状态与逻辑 hook */
export function useFileManager(initialParams?: {
  status?: string;
  uploaderId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { user, hasAnyRole } = useAuthStore();

  // ── 导航 ──
  // currentParentId: undefined = 不按文件夹筛选（显示全部文件）; null = 根目录; string = 具体文件夹
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null | undefined>(undefined);

  // ── 选择 ──
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<FileItem[]>([]);

  // ── 弹窗状态 ──
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<FileItem | null>(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<FileItem | null>(null);
  const [reuploadTarget, setReuploadTarget] = useState<FileItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // ── 详情抽屉 ──
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<FileItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── 表格数据 ──
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FileItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // ── 文件夹树刷新 ──
  const [folderTreeRefreshKey, setFolderTreeRefreshKey] = useState(0);
  const refreshFolderTree = useCallback(() => {
    setFolderTreeRefreshKey((v) => v + 1);
  }, []);

  // ── 筛选 ──
  const [keyword, setKeyword] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string[] | undefined>();
  const canFilterByDept = canShowFileDeptFilter(user?.role);
  const canFilterByUploader = canShowFileUploaderFilter(user?.role);

  const [uploaderFilter, setUploaderFilter] = useState<string | undefined>(
    initialParams?.uploaderId ??
      (canFilterByUploader ? undefined : user?.id),
  );
  const [deptFilter, setDeptFilter] = useState<string | undefined>(() => {
    if (initialParams?.departmentId) return initialParams.departmentId;
    if (user?.role === UserRole.DEPT_LEADER) return user.departmentId;
    return undefined;
  });
  const [sortState, setSortState] = useState<FileListSortState>(FILE_LIST_SORT_DEFAULT);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(initialParams?.status);
  const [fileExistenceFilter, setFileExistenceFilter] = useState<FileExistenceStatus | undefined>(
    FILE_EXISTENCE_FILTER_DEFAULT,
  );
  const [dateRange, setDateRange] = useState<[string, string] | null>(() => {
    if (initialParams?.startDate && initialParams?.endDate) {
      return [initialParams.startDate, initialParams.endDate];
    }
    return null;
  });

  // ── 数据获取 ──
  const { settings } = useSettingsStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { sortBy, sortOrder } = toFileListSortParams(sortState);
      const params: Record<string, unknown> = {
        page,
        pageSize,
        type: 'FILE',
        sortBy,
        sortOrder,
      };
      if (currentParentId !== undefined) params.parentId = currentParentId || 'root';
      if (keyword) params.keyword = keyword;
      if (uploaderFilter) params.uploaderId = uploaderFilter;
      if (deptFilter && canFilterByDept) {
        params.departmentId = deptFilter;
        params.fileScope = 'DEPARTMENT';
      }
      if (statusFilter) params.reviewStatus = statusFilter;
      if (fileExistenceFilter) params.fileExistenceStatus = fileExistenceFilter;
      if (fileTypeFilter && fileTypeFilter.length > 0) {
        // 支持类型名（如 Word）或扩展名（如 .docx），多选时合并所有扩展名
        const allExts: string[] = [];
        for (const item of fileTypeFilter) {
          if (item.startsWith('.')) {
            allExts.push(item);
          } else {
            const exts = settings.allowedFileTypes[item];
            if (exts) allExts.push(...exts);
          }
        }
        if (allExts.length > 0) params.extension = [...new Set(allExts)].join(',');
      }
      if (dateRange) {
        params.startDate = dateRange[0];
        params.endDate = dateRange[1];
      }

      const res = (await fileApi.list(params)) as unknown as {
        data: { list: FileItem[]; total: number };
      };
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      // 错误已由拦截器处理
    } finally {
      setLoading(false);
    }
  }, [
    page,
    pageSize,
    currentParentId,
    keyword,
    uploaderFilter,
    deptFilter,
    canFilterByDept,
    sortState,
    statusFilter,
    fileExistenceFilter,
    fileTypeFilter,
    dateRange,
    settings.allowedFileTypes,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── 权限判断 ──
  const canOperate = useCallback((record: FileItem) => checkCanOperate(record), []);

  // ── 导航处理 ──
  const handleEnterFolder = useCallback((folder: FileItem) => {
    setBreadcrumbItems((prev) => [...prev, { id: folder.id, name: folder.name }]);
    setCurrentParentId(folder.id);
    setPage(1);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  const handleBreadcrumbClick = useCallback((index: number) => {
    if (index === 0) {
      // 点击根目录：清除文件夹筛选
      setCurrentParentId(undefined);
      setBreadcrumbItems([]);
    } else {
      setBreadcrumbItems((prev) => {
        const newItems = prev.slice(0, index + 1);
        setCurrentParentId(newItems[newItems.length - 1]?.id ?? null);
        return newItems;
      });
    }
    setPage(1);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  /** 从树形组件导航到指定文件夹 */
  const navigateToFolder = useCallback((folderId: string | null, pathItems: BreadcrumbItem[]) => {
    setCurrentParentId(folderId);
    setBreadcrumbItems(pathItems);
    setPage(1);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  /** 清除文件夹筛选，回到显示全部文件的状态 */
  const clearFolderFilter = useCallback(() => {
    setCurrentParentId(undefined);
    setBreadcrumbItems([]);
    setPage(1);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  // ── 详情查看 ──
  const handleDetail = useCallback((record: FileItem) => {
    setDetailLoading(true);
    setDetailOpen(true);
    fileApi
      .get(record.id)
      .then((res) => {
        const d = (res as unknown as { data: FileItem }).data;
        // 合并列表数据作为兜底，防止详情接口缺少关联字段
        setDetailData({
          ...record,
          ...d,
          departmentName: d.departmentName || record.departmentName,
          uploaderName: d.uploaderName || record.uploaderName,
        });
      })
      .catch(() => setDetailData(record))
      .finally(() => setDetailLoading(false));
  }, []);

  // ── 重命名 ──
  const handleRename = useCallback((record: FileItem) => {
    setRenameTarget(record);
    setRenameOpen(true);
  }, []);

  const onRenameSubmit = useCallback(
    async (name: string) => {
      if (!renameTarget) return;
      await handleRenameSubmit(renameTarget.id, name, () => {
        setRenameOpen(false);
        setRenameTarget(null);
        if (renameTarget.type === 'FOLDER') refreshFolderTree();
        fetchData();
      });
    },
    [renameTarget, fetchData, refreshFolderTree],
  );

  // ── 移动 ──
  const handleMove = useCallback((record: FileItem) => {
    setMoveTarget(record);
    setMoveOpen(true);
  }, []);

  const onMoveSubmit = useCallback(
    async (targetFolderId: string | null) => {
      if (!moveTarget) return;
      await handleMoveSubmit(moveTarget.id, targetFolderId, () => {
        setMoveOpen(false);
        setMoveTarget(null);
        refreshFolderTree();
        fetchData();
      });
    },
    [moveTarget, fetchData, refreshFolderTree],
  );

  // ── 分页变更 ──
  const onPageChange = useCallback((p: number, ps: number) => {
    setPage(p);
    setPageSize(ps);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  // ── 筛选变更（自动重置页码） ──
  const changeKeyword = useCallback((v: string) => {
    setKeyword(v);
    setPage(1);
  }, []);
  const changeUploaderFilter = useCallback((v?: string) => {
    setUploaderFilter(v);
    setPage(1);
  }, []);
  const changeFileTypeFilter = useCallback((v?: string[]) => {
    setFileTypeFilter(v);
    setPage(1);
  }, []);
  const changeStatusFilter = useCallback((v?: string) => {
    setStatusFilter(v);
    setPage(1);
  }, []);
  const changeFileExistenceFilter = useCallback((v?: FileExistenceStatus) => {
    setFileExistenceFilter(v);
    setPage(1);
  }, []);
  const changeDateRange = useCallback((v: [string, string] | null) => {
    setDateRange(v);
    setPage(1);
  }, []);
  const changeDeptFilter = useCallback((v?: string) => {
    setDeptFilter(v);
    setPage(1);
  }, []);
  const changeSortState = useCallback((v: FileListSortState) => {
    setSortState(v);
    setPage(1);
  }, []);

  const folderTreeDeptId =
    (canFilterByDept ? deptFilter : undefined) ??
    (hasAnyRole([UserRole.SYSTEM_ADMIN, UserRole.REVIEWER]) ? undefined : user?.departmentId);

  return {
    // 导航
    breadcrumbItems,
    handleEnterFolder,
    handleBreadcrumbClick,
    navigateToFolder,
    clearFolderFilter,
    folderFilterActive: currentParentId !== undefined,
    // 权限
    canOperate,
    hasAnyRole,
    // 表格
    loading,
    data,
    total,
    page,
    pageSize,
    fetchData,
    onPageChange,
    // 选择
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRows,
    setSelectedRows,
    // 筛选
    keyword,
    uploaderFilter,
    fileTypeFilter,
    deptFilter,
    folderTreeDeptId,
    statusFilter,
    fileExistenceFilter,
    dateRange,
    sortState,
    changeKeyword,
    changeUploaderFilter,
    changeFileTypeFilter,
    changeDeptFilter,
    changeStatusFilter,
    changeFileExistenceFilter,
    changeDateRange,
    changeSortState,
    // 文件夹树
    folderTreeRefreshKey,
    refreshFolderTree,
    // 弹窗 - 重命名
    renameOpen,
    setRenameOpen,
    renameTarget,
    setRenameTarget,
    onRenameSubmit,
    handleRename,
    // 弹窗 - 移动
    moveOpen,
    setMoveOpen,
    moveTarget,
    setMoveTarget,
    onMoveSubmit,
    handleMove,
    // 弹窗 - 重新上传
    reuploadTarget,
    setReuploadTarget,
    // 弹窗 - 上传文件
    uploadModalOpen,
    setUploadModalOpen,
    // 详情抽屉
    detailOpen,
    detailData,
    detailLoading,
    setDetailOpen,
    setDetailData,
    handleDetail,
  };
}
