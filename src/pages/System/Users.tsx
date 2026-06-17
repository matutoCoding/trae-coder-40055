import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Table, Button, Modal, Form, Input, Select, Switch, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SysUser } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';

export default function UserManagement() {
  const { users, roles, addUser, updateUser, deleteUser, initMockData } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRecord, setSelectedRecord] = useState<SysUser | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<SysUser> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      render: (text) => <span className="font-mono text-primary-600">{text}</span>,
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
      render: (text) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          text === '系统管理员' ? 'bg-primary-100 text-primary-700' :
          text === '生产主管' ? 'bg-warning-100 text-warning-700' :
          text === '质量检验员' ? 'bg-success-100 text-success-700' :
          'bg-neutral-100 text-neutral-700'
        }`}>
          {text}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          status === 'active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'
        }`}>
          {status === 'active' ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<Edit2 size={14} />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setModalMode('add');
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: SysUser) => {
    setModalMode('edit');
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleView = (record: SysUser) => {
    Modal.info({
      title: '用户详情',
      width: 500,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-500">用户名</span>
            <span className="font-mono">{record.username}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-500">真实姓名</span>
            <span>{record.realName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-500">角色</span>
            <span>{record.roleName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-500">状态</span>
            <span>{record.status === 'active' ? '启用' : '禁用'}</span>
          </div>
        </div>
      ),
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？此操作不可恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        deleteUser(id);
        messageApi.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const role = roles.find((r) => r.id === values.roleId);
      
      if (modalMode === 'add') {
        addUser({
          ...values,
          roleName: role?.roleName || '',
        });
        messageApi.success('添加成功');
      } else if (selectedRecord) {
        updateUser(selectedRecord.id, {
          ...values,
          roleName: role?.roleName || '',
        });
        messageApi.success('更新成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleRefresh = () => {
    initMockData();
    message.success('数据已刷新');
  };

  return (
    <div>
      {contextHolder}
      
      <PageHeader
        icon={Users}
        title="用户管理"
        description="管理系统用户账户和权限配置"
        extra={
          <Space>
            <Button icon={<RefreshCw size={16} />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
              新增用户
            </Button>
          </Space>
        }
      />

      <div className="card">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10,
          }}
        />
      </div>

      <Modal
        title={modalMode === 'add' ? '新增用户' : '编辑用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText={modalMode === 'add' ? '提交' : '保存'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" initialValues={{ status: 'active' }}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              placeholder="请选择角色"
              options={roles.map((role) => ({
                label: role.roleName,
                value: role.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select
              placeholder="请选择状态"
              options={[
                { label: '启用', value: 'active' },
                { label: '禁用', value: 'inactive' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
