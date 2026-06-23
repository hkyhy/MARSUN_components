import { permissionApi } from '@/api';
import type { PersonOption } from '@/components/Common';
import { useDepartmentPath } from '@/hooks/useDepartmentPath';
import type { ReviewerOptionDto } from '@/utils/user/personOption';
import { toDepartmentPathMaps, toReviewerPersonOptions } from '@/utils/user/personOption';
import {
  handleApprove,
  handleReject,
  handleReturn,
  handleTransfer,
} from '@/components/Review/Action/handlers';
import type { ReviewListItem } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ReviewModalState {
  approveOpen: boolean;
  rejectOpen: boolean;
  returnOpen: boolean;
  transferOpen: boolean;
  currentRecord: ReviewListItem | null;
  submitting: boolean;
}

export interface ReviewModalProps {
  approve: {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onOk: (values: {
      needSecondReview?: boolean;
      secondReviewerId?: string;
      comment?: string;
    }) => Promise<void>;
  };
  reject: {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onOk: (values: { reason: string; comment?: string }) => Promise<void>;
  };
  return: {
    open: boolean;
    loading: boolean;
    onCancel: () => void;
    onOk: (values: { reason: string; comment?: string }) => Promise<void>;
  };
  transfer: {
    open: boolean;
    loading: boolean;
    reviewers: PersonOption[];
    onCancel: () => void;
    onOk: (values: { transferTo: string; reason: string }) => Promise<void>;
  };
}

interface UseReviewModalsOptions {
  onSuccess: () => void;
}

interface UseReviewModalsReturn {
  currentRecord: ReviewListItem | null;
  handleReviewAction: (
    action: 'approve' | 'reject' | 'return' | 'transfer',
    record: ReviewListItem,
  ) => void;
  modalProps: ReviewModalProps;
}

export function useReviewModals({ onSuccess }: UseReviewModalsOptions): UseReviewModalsReturn {
  const [state, setState] = useState<ReviewModalState>({
    approveOpen: false,
    rejectOpen: false,
    returnOpen: false,
    transferOpen: false,
    currentRecord: null,
    submitting: false,
  });
  const [rawReviewers, setRawReviewers] = useState<ReviewerOptionDto[]>([]);
  const { pathMap } = useDepartmentPath();

  const reviewers = useMemo(
    () => toReviewerPersonOptions(rawReviewers, toDepartmentPathMaps(pathMap)),
    [rawReviewers, pathMap],
  );

  // 加载审核人列表
  useEffect(() => {
    permissionApi
      .reviewers()
      .then((res) => {
        const d = (res as unknown as { data: ReviewerOptionDto[] }).data;
        setRawReviewers(d);
      })
      .catch(() => {});
  }, []);

  const closeAndRefresh = useCallback(() => {
    setState((s) => ({
      ...s,
      approveOpen: false,
      rejectOpen: false,
      returnOpen: false,
      transferOpen: false,
      currentRecord: null,
      submitting: false,
    }));
    onSuccess();
  }, [onSuccess]);

  const handleReviewAction = useCallback(
    (action: 'approve' | 'reject' | 'return' | 'transfer', record: ReviewListItem) => {
      setState((s) => ({ ...s, currentRecord: record }));
      switch (action) {
        case 'approve':
          setState((s) => ({ ...s, approveOpen: true }));
          break;
        case 'reject':
          setState((s) => ({ ...s, rejectOpen: true }));
          break;
        case 'return':
          setState((s) => ({ ...s, returnOpen: true }));
          break;
        case 'transfer':
          setState((s) => ({ ...s, transferOpen: true }));
          break;
      }
    },
    [],
  );

  const setSubmitting = useCallback((submitting: boolean) => {
    setState((s) => ({ ...s, submitting }));
  }, []);

  const modalProps: ReviewModalProps = {
    approve: {
      open: state.approveOpen,
      loading: state.submitting,
      onCancel: () =>
        setState((s) => ({ ...s, approveOpen: false, currentRecord: null })),
      onOk: async (values) => {
        setSubmitting(true);
        try {
          await handleApprove(state.currentRecord!, values, closeAndRefresh);
        } finally {
          setSubmitting(false);
        }
      },
    },
    reject: {
      open: state.rejectOpen,
      loading: state.submitting,
      onCancel: () =>
        setState((s) => ({ ...s, rejectOpen: false, currentRecord: null })),
      onOk: async (values) => {
        setSubmitting(true);
        try {
          await handleReject(state.currentRecord!, values, closeAndRefresh);
        } finally {
          setSubmitting(false);
        }
      },
    },
    return: {
      open: state.returnOpen,
      loading: state.submitting,
      onCancel: () =>
        setState((s) => ({ ...s, returnOpen: false, currentRecord: null })),
      onOk: async (values) => {
        setSubmitting(true);
        try {
          await handleReturn(state.currentRecord!, values, closeAndRefresh);
        } finally {
          setSubmitting(false);
        }
      },
    },
    transfer: {
      open: state.transferOpen,
      loading: state.submitting,
      reviewers,
      onCancel: () =>
        setState((s) => ({ ...s, transferOpen: false, currentRecord: null })),
      onOk: async (values) => {
        setSubmitting(true);
        try {
          await handleTransfer(state.currentRecord!, { transferToId: values.transferTo, reason: values.reason }, closeAndRefresh);
        } finally {
          setSubmitting(false);
        }
      },
    },
  };

  return {
    currentRecord: state.currentRecord,
    handleReviewAction,
    modalProps,
  };
}
