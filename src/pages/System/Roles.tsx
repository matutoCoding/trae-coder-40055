import { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Eye, RefreshCw } from 'lucide-react';
import { Table, Button, Modal, Form, Input, Checkbox, message, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { SysRole } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';

const permissionOptions = [
  { label: '查看数据', value: 'view' },
  { label: '新增记录', value: 'create' },
  { label: '编辑记录', value: 'edit' },
  { label: '删除记录', value: 'delete' },
  { label: '导出数据', value: 'export' },
  { label: '系统管理', value: 'manage' },
];

export default function RoleManagement() {
  const { roles, addRole, updateRole, deleteRole } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRecord, setSelectedRecord] = useState<SysRole | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<SysRole> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 180,
      render: (text) => <span className="font-medium text-neutral-700">{text}</span>,
    },
    {
      title: '权限列表',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.includes('*') ? (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">全部权限</span>
          ) : (
            permissions.map((perm) => {
              const option = permissionOptions.find((o) => o.value === perm);
              return (
                <span key={perm} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                  {option?.label || perm}
                </span>
              );
            })
          )}
        </div>
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
          {record.roleName !== '系统管理员' && (
            <Button
              type="link"
              size="small"
              danger
              icon={<Trash2 size={14} />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
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

  const handleEdit = (record: SysRole) => {
    setModalMode('edit');
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      permissions: record.permissions.includes('*') ? permissionOptions.map((o) => o.value) : record.permissions,
    });
    setIsModalVisible(true);
  };

  const handleView = (record: SysRole) => {
    Modal.info({
      title: '角色详情',
      width: 500,
      content: (
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-neutral-100">
            <span className="text-neutral-500">角色名称</span>
            <span>{record.roleName}</span>
          </div>
          <div className="py-2">
            <span className="text-neutral-500 block mb-2">权限列表</span>
            <div className="flex flex-wrap gap-1">
              {record.permissions.includes('*') ? (
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">全部权限</span>
              ) : (
                record.permissions.map((perm) => {
                  const option = permissionOptions.find((o) => o.value === perm);
                  return (
                    <span key={perm} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">
                      {option?.label || perm}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ),
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该角色吗？此操作不可恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        deleteRole(id);
        messageApi.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const allSelected = values.permissions?.length === permissionOptions.length;
      const permissions = allSelected ? ['*'] : values.permissions;
      
      if (modalMode === 'add') {
        addRole({
          roleName: values.roleName,
          permissions,
        });
        messageApi.success('添加成功');
      } else if (selectedRecord) {
        updateRole(selectedRecord.id, {
          roleName: values.roleName,
          permissions,
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
    message.success('数据已刷新');
  };

  return (
    <div>
      {contextHolder}
      
      <PageHeader
        icon={Shield}
        title="角色配置"
        description="管理系统角色和权限配置"
        extra={
          <Space>
            <Button icon={<RefreshCw size={16} />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
              新增角色
            </Button>
          </Space>
        }
      />

      <div className="card">
        <Table
          columns={columns}
          dataSource={roles}
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
        title={modalMode === 'add' ? '新增角色' : '编辑角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText={modalMode === 'add' ? '提交' : '保存'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限配置"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <Checkbox.Group
              className="grid grid-cols-2 gap-2"
              options={permissionOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
