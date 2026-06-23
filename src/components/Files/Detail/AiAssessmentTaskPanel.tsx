import { fileApi } from '@/api';
import AiAssessmentPanel from '@/components/Files/Detail/AiAssessmentPanel';
import type { AiAssessment, AssessmentTaskStatus } from '@/types';
import { ReviewStatus } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';

interface AiAssessmentTaskPanelProps {
  fileId: string;
  assessment?: AiAssessment | null;
  reviewStatus?: ReviewStatus | string;
  title?: string;
}

const SUBMITTED_STATUSES: ReviewStatus[] = [
  ReviewStatus.PENDING_REVIEWER,
  ReviewStatus.REVIEWING_REVIEWER,
  ReviewStatus.PENDING_SECOND_REVIEWER,
  ReviewStatus.REVIEWING_SECOND_REVIEWER,
  ReviewStatus.APPROVED,
  ReviewStatus.REJECTED,
  ReviewStatus.RETURNED,
];

const AiAssessmentTaskPanel: React.FC<AiAssessmentTaskPanelProps> = ({
  fileId,
  assessment,
  reviewStatus,
  title,
}) => {
  const [taskStatus, setTaskStatus] = useState<AssessmentTaskStatus | null>(null);

  const fetchTaskStatus = useCallback(async () => {
    try {
      const res = (await fileApi.getAssessmentTaskStatus(fileId)) as unknown as {
        data: { status: AssessmentTaskStatus } | null;
      };
      setTaskStatus(res.data?.status ?? null);
    } catch {
      // ignore
    }
  }, [fileId]);

  useEffect(() => {
    if (assessment) return;
    const isSubmitted =
      reviewStatus && SUBMITTED_STATUSES.includes(reviewStatus as ReviewStatus);
    if (!isSubmitted) return;

    fetchTaskStatus();
    const timer = setInterval(fetchTaskStatus, 5000);
    return () => clearInterval(timer);
  }, [assessment, reviewStatus, fetchTaskStatus]);

  const pendingHint =
    reviewStatus === ReviewStatus.DRAFT || reviewStatus === ReviewStatus.REVOKED
      ? 'pending_submit'
      : undefined;

  return (
    <AiAssessmentPanel
      assessment={assessment}
      taskStatus={assessment ? null : taskStatus}
      pendingHint={pendingHint}
      title={title}
    />
  );
};

export default AiAssessmentTaskPanel;
