import { statsApi } from '@/api';
import type {
  DeptPointsStat,
  FileTypeStat,
  PersonalPointsStat,
  StatsFilterParams,
  UploadTrendPoint,
} from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function useDashboardAnalytics(filterParams: StatsFilterParams) {
  const filterKey = useMemo(
    () =>
      JSON.stringify({
        startDate: filterParams.startDate,
        endDate: filterParams.endDate,
        departmentId: filterParams.departmentId,
        keyword: filterParams.keyword,
      }),
    [filterParams.startDate, filterParams.endDate, filterParams.departmentId, filterParams.keyword],
  );
  const [trendData, setTrendData] = useState<UploadTrendPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [typeData, setTypeData] = useState<FileTypeStat[]>([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [deptPoints, setDeptPoints] = useState<DeptPointsStat[]>([]);
  const [deptPointsLoading, setDeptPointsLoading] = useState(false);
  const [personalPoints, setPersonalPoints] = useState<PersonalPointsStat[]>([]);
  const [personalTotal, setPersonalTotal] = useState(0);
  const [personalPage, setPersonalPage] = useState(1);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [trendDays, setTrendDays] = useState(30);

  const fetchTrend = useCallback(async () => {
    setTrendLoading(true);
    try {
      const params = filterParams.startDate ? filterParams : { ...filterParams, days: trendDays };
      const res = await statsApi.uploadsTrend(params);
      setTrendData((res as unknown as { data: UploadTrendPoint[] }).data || []);
    } catch {
      setTrendData([]);
    } finally {
      setTrendLoading(false);
    }
  }, [filterKey, filterParams, trendDays]);

  const fetchTypes = useCallback(async () => {
    setTypeLoading(true);
    try {
      const res = await statsApi.fileTypes(filterParams);
      setTypeData((res as unknown as { data: FileTypeStat[] }).data || []);
    } catch {
      setTypeData([]);
    } finally {
      setTypeLoading(false);
    }
  }, [filterKey, filterParams]);

  const fetchDeptPoints = useCallback(async () => {
    setDeptPointsLoading(true);
    try {
      const res = await statsApi.pointsDepartments(filterParams);
      setDeptPoints((res as unknown as { data: DeptPointsStat[] }).data || []);
    } catch {
      setDeptPoints([]);
    } finally {
      setDeptPointsLoading(false);
    }
  }, [filterKey, filterParams]);

  const fetchPersonalPoints = useCallback(async () => {
    setPersonalLoading(true);
    try {
      const res = await statsApi.pointsPersonal({
        ...filterParams,
        page: personalPage,
        pageSize: 20,
      });
      const body = res as unknown as {
        data: { list: PersonalPointsStat[]; total: number };
      };
      setPersonalPoints(body.data?.list || []);
      setPersonalTotal(body.data?.total || 0);
    } catch {
      setPersonalPoints([]);
      setPersonalTotal(0);
    } finally {
      setPersonalLoading(false);
    }
  }, [filterKey, filterParams, personalPage]);

  useEffect(() => {
    setPersonalPage(1);
  }, [filterKey]);

  useEffect(() => {
    fetchTrend();
    fetchTypes();
    fetchDeptPoints();
  }, [fetchTrend, fetchTypes, fetchDeptPoints]);

  useEffect(() => {
    fetchPersonalPoints();
  }, [fetchPersonalPoints]);

  return {
    trendData,
    trendLoading,
    trendDays,
    setTrendDays,
    typeData,
    typeLoading,
    deptPoints,
    deptPointsLoading,
    personalPoints,
    personalTotal,
    personalPage,
    setPersonalPage,
    personalLoading,
    refreshAll: () => {
      fetchTrend();
      fetchTypes();
      fetchDeptPoints();
      fetchPersonalPoints();
    },
  };
}

export type UseDashboardAnalyticsReturn = ReturnType<typeof useDashboardAnalytics>;
