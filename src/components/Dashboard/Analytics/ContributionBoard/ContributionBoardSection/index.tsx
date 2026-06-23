import type { StatsFilterParams } from '@/types';
import { Col, Row } from 'antd';
import React from 'react';
import { useAssetBoard } from '../../../AssetBoard/hooks/useAssetBoard';
import PointsGuide from '../../../AssetBoard/PointsGuide';
import RankingDetailTable from '../../../AssetBoard/RankingDetailTable';
import RealtimeBroadcast from '../../../AssetBoard/RealtimeBroadcast';
import TopFiveList from '../../../AssetBoard/TopFiveList';
import styles from './style.module.scss';
import classNames from 'classnames';

interface ContributionBoardSectionProps {
  filterParams: StatsFilterParams;
}

/** 资产贡献榜区块（嵌入工作台统计分析） */
const ContributionBoardSection: React.FC<ContributionBoardSectionProps> = ({ filterParams }) => {
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
  } = useAssetBoard({ filterParams });

  return (
    <div className={classNames('contribution-board-section-container', styles['contribution-board-section-container'])}>
      <RealtimeBroadcast data={broadcastList} />
      <Row gutter={[16, 0]} align="stretch">
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
        <Col xs={24} lg={9}>
          <PointsGuide />
        </Col>
      </Row>
      <RankingDetailTable
        dimension={dimension}
        scoreType={scoreType}
        uploadData={uploadRankingData}
        qualityData={qualityRankingData}
      />
    </div>
  );
};

export default ContributionBoardSection;
