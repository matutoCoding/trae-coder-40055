import { useRoutes } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import routes from '@/router';

export default function App() {
  const element = useRoutes(routes);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#165DFF',
          colorSuccess: '#00B42A',
          colorWarning: '#FF7D00',
          colorError: '#F53F3F',
          borderRadius: 6,
        },
        components: {
          Button: {
            colorPrimary: '#165DFF',
          },
        },
      }}
    >
      <AntdApp>
        {element}
      </AntdApp>
    </ConfigProvider>
  );
}
