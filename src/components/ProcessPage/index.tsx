import { ReactNode, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, Space, message, Drawer } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw } from 'lucide-react';
import type { ProcessStatus } from '@/types';
import { statusTextMap } from '@/utils/mock';
import StatusTag from '@/components/StatusTag';
import PageHeader from '@/components/PageHeader';
import type { LucideIcon } from 'lucide-react';
import dayjs from 'dayjs';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'datetime' | 'textarea';
  options?: { label: string; value: string | number | boolean }[];
  required?: boolean;
  placeholder?: string;
  rules?: any[];
}

interface ProcessPageProps<T extends { id: string }> {
  title: string;
  description: string;
  icon: LucideIcon;
  data: T[];
  columns: ColumnsType<T>;
  fields: FieldConfig[];
  onAdd: (data: Omit<T, 'id'>) => void;
  onUpdate: (id: string, data: Partial<T>) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  extraFilters?: ReactNode;
  renderDetail?: (record: T) => ReactNode;
}

export default function ProcessPage<T extends { id: string }>({
  title,
  description,
  icon,
  data,
  columns,
  fields,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
  extraFilters,
  renderDetail,
}: ProcessPageProps<T>) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const statusOptions: { label: string; value: ProcessStatus }[] = [
    { label: '待处理', value: 'pending' },
    { label: '处理中', value: 'processing' },
    { label: '已完成', value: 'completed' },
    { label: '合格', value: 'qualified' },
    { label: '不合格', value: 'unqualified' },
  ];

  const filteredData = data.filter((item) => {
    const matchesSearch = searchText === '' || 
      Object.values(item).some((val) => 
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
    const matchesStatus = statusFilter === '' || (item as any).status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setModalMode('add');
    setSelectedRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: T) => {
    setModalMode('edit');
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      startTime: (record as any).startTime ? dayjs((record as any).startTime) : undefined,
      endTime: (record as any).endTime ? dayjs((record as any).endTime) : undefined,
      processTime: (record as any).processTime ? dayjs((record as any).processTime) : undefined,
      quenchingTime: (record as any).quenchingTime ? dayjs((record as any).quenchingTime) : undefined,
      temperingTime: (record as any).temperingTime ? dayjs((record as any).temperingTime) : undefined,
      assemblyTime: (record as any).assemblyTime ? dayjs((record as any).assemblyTime) : undefined,
      testTime: (record as any).testTime ? dayjs((record as any).testTime) : undefined,
      groupDate: (record as any).groupDate ? dayjs((record as any).groupDate) : undefined,
      packageDate: (record as any).packageDate ? dayjs((record as any).packageDate) : undefined,
    });
    setIsModalVisible(true);
  };

  const handleView = (record: T) => {
    setSelectedRecord(record);
    setIsDetailVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？此操作不可恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        onDelete(id);
        messageApi.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const processedValues = { ...values };
      Object.keys(processedValues).forEach((key) => {
        if (processedValues[key]?.format) {
          processedValues[key] = processedValues[key].format('YYYY-MM-DD HH:mm:ss');
        }
      });

      if (modalMode === 'add') {
        onAdd(processedValues as Omit<T, 'id'>);
        messageApi.success('添加成功');
      } else if (selectedRecord) {
        onUpdate(selectedRecord.id, processedValues as Partial<T>);
        messageApi.success('更新成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const renderFormField = (field: FieldConfig) => {
    const baseProps = {
      placeholder: field.placeholder || `请输入${field.label}`,
      style: { width: '100%' },
    };

    switch (field.type) {
      case 'text':
        return <Input {...baseProps} />;
      case 'number':
        return <InputNumber {...baseProps} style={{ width: '100%' }} />;
      case 'select':
        return <Select {...baseProps} options={field.options} />;
      case 'date':
        return <DatePicker {...baseProps} style={{ width: '100%' }} />;
      case 'datetime':
        return <DatePicker {...baseProps} showTime style={{ width: '100%' }} />;
      case 'textarea':
        return <Input.TextArea {...baseProps} rows={3} />;
      default:
        return <Input {...baseProps} />;
    }
  };

  const actionColumns: ColumnsType<T> = [
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
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
            onClick={() => handleDelete((record as any).id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const allColumns = [...columns, ...actionColumns];

  const statusColumn = allColumns.find((col) => (col as any).dataIndex === 'status');
  if (statusColumn && !statusColumn.render) {
    statusColumn.render = (status: ProcessStatus) => <StatusTag status={status} />;
  }

  return (
    <div>
      {contextHolder}
      
      <PageHeader
        icon={icon}
        title={title}
        description={description}
        extra={
          <Space>
            <Button icon={<RefreshCw size={16} />} onClick={onRefresh}>
              刷新
            </Button>
            <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
              新增记录
            </Button>
          </Space>
        }
      />

      <div className="card mb-6 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-neutral-400" />
            <Input
              placeholder="搜索批次号、操作员..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
              allowClear
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">状态:</span>
            <Select
              placeholder="全部状态"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || '')}
              className="w-36"
              allowClear
              options={statusOptions.map((opt) => ({
                label: opt.label,
                value: opt.value,
              }))}
            />
          </div>
          {extraFilters}
        </div>
      </div>

      <div className="card">
        <Table
          columns={allColumns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10,
          }}
        />
      </div>

      <Modal
        title={modalMode === 'add' ? `新增${title}` : `编辑${title}`}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText={modalMode === 'add' ? '提交' : '保存'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'pending' }}
        >
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : field.rules}
              >
                {renderFormField(field)}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>

      <Drawer
        title="详情查看"
        placement="right"
        width={500}
        open={isDetailVisible}
        onClose={() => setIsDetailVisible(false)}
      >
        {selectedRecord && renderDetail ? (
          renderDetail(selectedRecord)
        ) : (
          selectedRecord && (
            <div className="space-y-4">
              {Object.entries(selectedRecord).map(([key, value]) => {
                if (key === 'id') return null;
                const field = fields.find((f) => f.name === key);
                const label = field?.label || key;
                let displayValue = value;
                if (key === 'status' && typeof value === 'string') {
                  return (
                    <div key={key} className="flex justify-between py-2 border-b border-neutral-100">
                      <span className="text-neutral-500">{label}</span>
                      <StatusTag status={value as ProcessStatus} />
                    </div>
                  );
                }
                if (key === 'ringType' && typeof value === 'string') {
                  displayValue = value === 'inner' ? '内圈' : '外圈';
                }
                return (
                  <div key={key} className="flex justify-between py-2 border-b border-neutral-100">
                    <span className="text-neutral-500">{label}</span>
                    <span className="font-mono text-neutral-700">{String(displayValue)}</span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </Drawer>
    </div>
  );
}
