import { feedbackApi } from '@/api';
import type { FeedbackComment, FeedbackItem } from '@/types';
import { Send } from '@/icons';
import { Avatar, Button, Card, Input, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

interface FeedbackCommentsProps {
  detail: FeedbackItem;
  onRefresh: () => void;
}

/** 评论列表渲染 */
const CommentList: React.FC<{ comments?: FeedbackComment[] }> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <div className={classNames('feedback-comments-empty-comments', styles['feedback-comments-empty-comments'])}>暂无评论</div>;
  }
  return (
    <div className={classNames('feedback-comments-comment-list', styles['feedback-comments-comment-list'])}>
      {comments.map((c) => (
        <div key={c.id} className={classNames('feedback-comments-comment-item', styles['feedback-comments-comment-item'])}>
          <Avatar size="small" className={classNames('feedback-comments-comment-avatar', styles['feedback-comments-comment-avatar'])}>
            {c.author?.displayName?.[0] || '?'}
          </Avatar>
          <div className={classNames('feedback-comments-comment-body', styles['feedback-comments-comment-body'])}>
            <div className={classNames('feedback-comments-comment-header', styles['feedback-comments-comment-header'])}>
              <span className={classNames('feedback-comments-comment-author', styles['feedback-comments-comment-author'])}>{c.author?.displayName || '未知'}</span>
              <span className={classNames('feedback-comments-comment-time', styles['feedback-comments-comment-time'])}>
                {dayjs(c.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </div>
            <div className={classNames('feedback-comments-comment-content', styles['feedback-comments-comment-content'])}>{c.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/** 评论区组件 */
const FeedbackComments: React.FC<FeedbackCommentsProps> = ({ detail, onRefresh }) => {
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      await feedbackApi.addComment(detail.id, { content: commentText.trim() });
      message.success('评论成功');
      setCommentText('');
      onRefresh();
    } catch {
      // handled
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <Card title={`评论 (${detail.commentCount})`} size="small" className={classNames('feedback-comments-comments-card', styles['feedback-comments-comments-card'])}>
      <CommentList comments={detail.comments} />
      <div className={classNames('feedback-comments-comment-input-row', styles['feedback-comments-comment-input-row'])}>
        <Input.TextArea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="输入评论内容..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <Button
          type="primary"
          icon={<Send />}
          loading={commentSubmitting}
          disabled={!commentText.trim()}
          onClick={handleAddComment}
        >
          发送
        </Button>
      </div>
    </Card>
  );
};

export default FeedbackComments;
