import type { ReviewMode } from './types';

export const MODE_CONFIG: Record<ReviewMode, { title: string; emptyText: string }> = {
  all: { title: '全部审核', emptyText: '暂无审核记录' },
  pending: { title: '待我处理', emptyText: '暂无待处理审核' },
  processed: { title: '我已处理', emptyText: '暂无已处理审核' },
  received: { title: '我收到的', emptyText: '暂无收到的审核' },
  initiated: { title: '我发起的', emptyText: '暂无发起的审核' },
};
