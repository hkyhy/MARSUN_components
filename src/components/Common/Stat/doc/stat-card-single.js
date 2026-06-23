const { StatCard } = _Common;
import { CloudUpload, FileText, User } from '@/icons';

/** StatCard 单个卡片示例 */
const StatCardSingleDemo = () => (
  <div className={'stat-card-single-demo-wrapper'}>
    {/* 基础用法 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>基础用法</h4>
      <StatCard title="总文件数" value={128} />
    </div>

    {/* 带前缀图标 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>带前缀图标</h4>
      <div className={'stat-card-single-demo-body'}>
        <StatCard title="文件数" value={128} prefix={<FileText />} />
        <StatCard title="上传量" value={56} prefix={<CloudUpload />} color="#1677ff" />
        <StatCard title="用户数" value={2048} prefix={<User />} color="#52c41a" />
      </div>
    </div>

    {/* 自定义颜色 + 点击事件 */}
    <div>
      <h4 className={'stat-card-single-demo-header'}>自定义颜色 & 可点击</h4>
      <StatCard
        title="本月新增"
        value={42}
        color="#fa8c16"
        onClick={() => alert('查看详情')}
        style={{ maxWidth: 280 }}
      />
    </div>
  </div>
);

render(<StatCardSingleDemo />);
