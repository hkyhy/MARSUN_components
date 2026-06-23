import { Send, Trophy } from '@/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssetBoard } from '../hooks/useAssetBoard';
import PointsGuide from '../PointsGuide';
import RankingDetailTable from '../RankingDetailTable';
import RealtimeBroadcast from '../RealtimeBroadcast';
import TopFiveList from '../TopFiveList';
import styles from './style.module.scss';
import classNames from 'classnames';

const { Title, Text } = Typography;

/** 资产贡献榜 - 主容器 */
const AssetContributionBoard: React.FC = () => {
  const navigate = useNavigate();
  const {
    broadcastList,
    leaderboardData,
    uploadRankingData,
    qualityRankingData,
    loading,
    dimension,
    setDimension,
    scoreType,
    setScoreType,
  } = useAssetBoard();

  return (
    <div className={classNames('asset-contribution-board-root', styles['asset-contribution-board-root'])}>
      {/* ===== 标题区域 ===== */}
      <Card
        variant="borderless"
        className="shadow-none"
        styles={{ body: { padding: '20px 24px' } }}
      >
        <div className={classNames('asset-contribution-board-container', styles['asset-contribution-board-container'])}>
          <div>
            <Space align="center" size="middle">
              <Trophy className={classNames('asset-contribution-board-wrapper', styles['asset-contribution-board-wrapper'])} />
              <Title level={3} className={classNames('asset-contribution-board-inner', styles['asset-contribution-board-inner'])}>
                资产贡献榜
                <Text type="secondary" className={classNames('asset-contribution-board-header', styles['asset-contribution-board-header'])}>
                  （两级考评排行榜）
                </Text>
              </Title>
            </Space>
            <Text type="secondary" className={classNames('asset-contribution-board-body', styles['asset-contribution-board-body'])}>
              系统实时汇算两级审核结果与打分，多维度、全公允反映各事业分会、干群个人贡献。
            </Text>
          </div>
          <Button
            type="primary"
            icon={<Send />}
            className={classNames('asset-contribution-board-footer', styles['asset-contribution-board-footer'])}
            onClick={() => navigate('/files/upload')}
            style={{ borderRadius: 8 }}
          >
            一键提报 ✨
          </Button>
        </div>
      </Card>

      {/* ===== 实时动态播报 ===== */}
      <RealtimeBroadcast data={broadcastList} />

      {/* ===== 积分榜区域（左右布局） ===== */}
      <Row gutter={[16, 0]} align="stretch">
        {/* 左侧：前五排行列表 */}
        <Col xs={24} lg={15}>
          <TopFiveList
            data={leaderboardData}
            loading={loading}
            dimension={dimension}
            onDimensionChange={setDimension}
            scoreType={scoreType}
            onScoreTypeChange={setScoreType}
          />
        </Col>

        {/* 右侧：积分说明面板 */}
        <Col xs={24} lg={9}>
          <PointsGuide />
        </Col>
      </Row>

      {/* ===== 排行详情表格 ===== */}
      <RankingDetailTable
        dimension={dimension}
        scoreType={scoreType}
        uploadData={uploadRankingData}
        qualityData={qualityRankingData}
      />
    </div>
  );
};

export default AssetContributionBoard;
