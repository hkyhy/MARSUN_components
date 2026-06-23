import { fileApi, statsApi } from '@/api';
import type { StatsFilterParams } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import type { BroadcastItem, LeaderboardItem, QualityScoreItem, UploadVolumeItem } from '../types';

interface UseAssetBoardOptions {
  filterParams?: StatsFilterParams;
}

const EMPTY_FILTER_PARAMS: StatsFilterParams = {};

interface UseAssetBoardReturn {
  broadcastList: BroadcastItem[];
  leaderboardData: LeaderboardItem[];
  uploadRankingData: UploadVolumeItem[];
  qualityRankingData: QualityScoreItem[];
  loading: boolean;
  dimension: 'department' | 'personal';
  setDimension: (v: 'department' | 'personal') => void;
  scoreType: 'quality' | 'upload';
  setScoreType: (v: 'quality' | 'upload') => void;
}

export function useAssetBoard(options: UseAssetBoardOptions = {}): UseAssetBoardReturn {
  const { filterParams = EMPTY_FILTER_PARAMS } = options;
  const [broadcastList, setBroadcastList] = useState<BroadcastItem[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [uploadRankingData, setUploadRankingData] = useState<UploadVolumeItem[]>([]);
  const [qualityRankingData, setQualityRankingData] = useState<QualityScoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dimension, setDimension] = useState<'department' | 'personal'>('department');
  const [scoreType, setScoreType] = useState<'quality' | 'upload'>('upload');

  const filterKey = JSON.stringify(filterParams);

  const fetchBroadcast = useCallback(async () => {
    try {
      const res = await fileApi.list({
        pageSize: 5,
        type: 'FILE',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      } as Record<string, unknown>);
      const body = res as unknown as { data: { list: Record<string, unknown>[] } };
      if (body?.data?.list) {
        setBroadcastList(
          body.data.list.map(
            (raw) =>
              ({
                ...raw,
                fileName: String(raw.name ?? raw.fileName ?? ''),
              }) as BroadcastItem,
          ),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  const fetchUploadRanking = useCallback(async () => {
    try {
      const res = await statsApi.uploadVolumeRanking({ period: 'all', dimension, ...filterParams });
      const rawList = (res as unknown as { data: Record<string, unknown>[] }).data || [];
      setUploadRankingData(
        rawList.map((item, idx) => ({
          rank: idx + 1,
          userId: item.userId as string | undefined,
          userName: item.userName as string | undefined,
          departmentName: item.departmentName as string | undefined,
          departmentId: item.departmentId as string | undefined,
          fileCount: (item.fileCount ?? 0) as number,
          totalSize: (item.totalSize ?? 0) as number,
          activeUploaders: item.activeUploaders as number | undefined,
        })),
      );
    } catch {
      setUploadRankingData([]);
    }
  }, [dimension, filterKey]);

  const fetchQualityRanking = useCallback(async () => {
    try {
      const res = await statsApi.totalScoreRanking({ period: 'all', dimension, ...filterParams });
      const rawList = (res as unknown as { data: Record<string, unknown>[] }).data || [];
      setQualityRankingData(
        rawList.map((item, idx) => ({
          rank: idx + 1,
          userId: item.userId as string | undefined,
          userName: item.userName as string | undefined,
          departmentName: item.departmentName as string | undefined,
          departmentId: item.departmentId as string | undefined,
          approvedCount: (item.approvedCount ?? 0) as number,
          effectiveCount: item.effectiveCount as number | undefined,
          belowLineCount: item.belowLineCount as number | undefined,
          totalScore: (item.totalScore ?? 0) as number,
          avgScore: item.avgScore as number | undefined,
          deptAvgScore: item.deptAvgScore as number | undefined,
          companyAvgScore: item.companyAvgScore as number | undefined,
          activeUploaders: item.activeUploaders as number | undefined,
          perCapitaScore: item.perCapitaScore as number | undefined,
        })),
      );
    } catch {
      setQualityRankingData([]);
    }
  }, [dimension, filterKey]);

  const fetchAllRankings = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchUploadRanking(), fetchQualityRanking()]);
    setLoading(false);
  }, [fetchUploadRanking, fetchQualityRanking]);

  const buildTop5 = useCallback(() => {
    const source = scoreType === 'quality' ? qualityRankingData : uploadRankingData;
    setLeaderboardData(
      source.slice(0, 5).map((item) => ({
        rank: item.rank,
        departmentName: item.departmentName,
        userName: item.userName,
        totalScore:
          scoreType === 'quality'
            ? ((item as QualityScoreItem).totalScore ?? 0)
            : ((item as UploadVolumeItem).fileCount ?? 0),
        fileCount: (item as UploadVolumeItem).fileCount ?? 0,
        approvedCount: (item as QualityScoreItem).approvedCount ?? 0,
        avgScore: (item as QualityScoreItem).avgScore,
        deptAvgScore: (item as QualityScoreItem).deptAvgScore,
        companyAvgScore: (item as QualityScoreItem).companyAvgScore,
      })),
    );
  }, [scoreType, qualityRankingData, uploadRankingData]);

  useEffect(() => {
    fetchBroadcast();
    fetchAllRankings();
    const timer = setInterval(fetchBroadcast, 30000);
    return () => clearInterval(timer);
  }, [fetchBroadcast, fetchAllRankings]);

  useEffect(() => {
    buildTop5();
  }, [buildTop5]);

  return {
    broadcastList,
    leaderboardData,
    uploadRankingData,
    qualityRankingData,
    loading,
    dimension,
    setDimension,
    scoreType,
    setScoreType,
  };
}
