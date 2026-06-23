import { BookOpen, FileText, Trophy } from '@/icons';
import { Card, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Text, Paragraph, Title } = Typography;

const PointsGuide: React.FC = () => {
  return (
    <Card
      variant="borderless"
      className={classNames('points-guide-row', styles['points-guide-row'])}
      styles={{ body: { padding: '16px 20px' } }}
    >
      <div className={classNames('points-guide-col', styles['points-guide-col'])}>
        <Trophy className={classNames('points-guide-wrap', styles['points-guide-wrap'])} />
        <Text strong className={classNames('points-guide-panel', styles['points-guide-panel'])}>
          如何获得考评积分奖励？
        </Text>
      </div>

      <div className={classNames('points-guide-card', styles['points-guide-card'])}>
        <section>
          <Title level={5} className={classNames('points-guide-item', styles['points-guide-item'])}>
            <FileText /> 一、积分定义与原则
          </Title>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            1. 「上传≠得分」：仅当文件通过业务审核、状态标记为「可计分结案」后，方可触发积分计算与入账。
          </Paragraph>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            2. 积分非绩效考核直接依据：积分结果作为排行榜排名、奖励候选名单生成、评优推荐材料的客观数据源。
          </Paragraph>
          <Paragraph className={classNames('points-guide-label', styles['points-guide-label'])}>
            3. 一人一账号，工号唯一绑定：所有行为均以实名工号为唯一标识，杜绝代操作、刷量行为。
          </Paragraph>
        </section>

        <section>
          <Title level={5} className={classNames('points-guide-item', styles['points-guide-item'])}>
            <Trophy /> 二、积分构成与计算规则
          </Title>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            <Text strong>基础分</Text>：单次提交通过审核并结案 +10 分/件。
          </Paragraph>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            <Text strong>质量分</Text>：AI 质量评级 — 极高质量 +15 分、高质量 +8 分、中等质量 +0 分。
          </Paragraph>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            <Text strong>效果分</Text>：智能体引用（阶梯计分）+ 获赞 +5 分/次（本人不计分）。
          </Paragraph>
          <Paragraph className={classNames('points-guide-link', styles['points-guide-link'])}>
            <Text strong>行为分</Text>：审核员标记「优秀案例」+20 分/次（每位审核员每月最多 5 次）。
          </Paragraph>
          <Paragraph className={classNames('points-guide-label', styles['points-guide-label'])}>
            <Text strong>总积分</Text> = 基础分 + 质量分 + 效果分 + 行为分
          </Paragraph>
        </section>

        <section>
          <Title level={5} className={classNames('points-guide-item', styles['points-guide-item'])}>
            <BookOpen /> 三、《内容质量评估指南》（AI 自动化评级）
          </Title>
          <Link to="/guide/quality-assessment" className={classNames('text-primary', classNames('points-guide-value', styles['points-guide-value']))}>
            点击查看完整评估指南 →
          </Link>
        </section>
      </div>
    </Card>
  );
};

export default PointsGuide;
