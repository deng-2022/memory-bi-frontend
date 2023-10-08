import {UploadOutlined} from '@ant-design/icons';
import {Avatar, Button, Card, Col, Divider, Form, Input, List, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {useEffect, useState} from 'react';
import ReactECharts from 'echarts-for-react';
import {listChartByPageUsingPOST} from "@/services/memory-bi/chartController";
import Search from "antd/es/input/Search";

/**
 * 添加图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4
  }
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})
  const [chartList, setChartList] = useState<API.Chart[]>()
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listChartByPageUsingPOST(searchParams);
      if (res.data) {
        // 获取图表列表
        setChartList(res.data?.records ?? []);
        // 获取总数
        setTotal(res.data?.total ?? 0);
        // 搜索完成
        setLoading(false);

      } else {
        message.error("获取我的图标失败")
      }
    } catch (e: any) {
      message.error("获取我的图标失败" + e.message)
    }
  }

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="page-chart">
      <Search
        className="margin-bottom-16"
        placeholder="请输入图表名称"
        enterButton
        loading={loading}
        onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      {/*{JSON.stringify(chartList)}*/}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            setSearchParams({
              ...searchParams,
              current: page,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <Card className="margin-bottom-16  margin-right-16">
            <List.Item
              key={item.id}
            >
              <List.Item.Meta
                avatar={<Avatar src={"https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}/>}
                title={item.name}
                description={item.chartType}
              />
              {<p>{'分析目标：' + item.goal}</p>}
              {/*{JSON.stringify(item.genChart)}*/}
              <ReactECharts option={item.genChart && JSON.parse(item.genChart)}/>
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};
export default MyChartPage;
