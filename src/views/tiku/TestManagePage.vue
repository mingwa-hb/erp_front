<template>
  <a-card class="page-container" :bordered="false">
  <a-table :columns="columns" :data-source="dataSource" bordered rowKey="id">
<!--    <span slot="paperName" slot-scope="text, record">-->
<!--      <a target="_blank" :href="'/itiku/PreviewTestPaperPage?paperId=' + record.id" :title="record.paperName">{{-->
<!--        record.paperName-->
<!--      }}</a>-->
<!--    </span>-->
    <template
      v-for="col in ['examStatus']"
      :slot="col"
      slot-scope="text, record, index"
    >
      <div :key="col" v-if="record.editable" style="width:120px">
        <a-select
          style="width:100%"
          placeholder="请选择状态"
          :value="text"
          @change="e => handleChange(e, record.id, col)"
        >
          <a-select-option value="1" v-if="record.examStatus=='1'">未开始</a-select-option>
          <a-select-option value="2" v-if="record.examStatus=='1' || record.examStatus=='2'">考试中</a-select-option>
          <a-select-option value="3" v-if="record.examStatus=='2' || record.examStatus=='3'">已结束</a-select-option>
        </a-select>
      </div>
      <div :key="col" v-else>
        <template v-if="record.examStatus=='1'">
          未开始
        </template>
        <template v-if="record.examStatus=='2'">
          考试中
        </template>
        <template v-if="record.examStatus=='3'">
          已结束
        </template>
      </div>
    </template>
    <span slot="paperName" slot-scope="text, record">
          <a target="_blank" :href="'/itiku/PreviewTestPaperPage?paperId=' + record.paperId" :title="record.paperName">{{
            record.paperName
          }}</a>
    </span>
    <span slot="paperIdRelatedList" slot-scope="text, record">
      <div v-for="item in record.paperIdRelatedList">
         <a  target="_blank" :href="'/itiku/PreviewTestPaperPage?paperId=' + item.id" :title="item.paperName">{{
            item.paperName
          }}</a>
      </div>
    </span>
    <template slot="operation" slot-scope="text, record, index">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.id)">保存</a>
          <a-popconfirm title="确定取消编辑吗?" @confirm="() => cancel(record.id)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑状态</a>
        </span>
      </div>
    </template>
  </a-table>
  </a-card>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { testPlanApiList } from '@/api/api'
  const columns = [
    {
      title: '考试计划名称',
      dataIndex: 'scheduleName',
      width: '10%',
      scopedSlots: { customRender: 'scheduleName' },
    },
    {
      title: '工种',
      dataIndex: 'workTypeName',
      width: '10%',
      scopedSlots: { customRender: 'workTypeName' },
    },
    {
      title: '等级',
      dataIndex: 'workLevel',
      width: '5%',
      scopedSlots: { customRender: 'workLevel' },
    },
    {
      title: '试卷',
      dataIndex: 'paperName',
      width: '15%',
      scopedSlots: { customRender: 'paperName' },
    },
    {
      title: '相关试卷',
      dataIndex: 'paperIdRelatedList',
      width: '15%',
      scopedSlots: { customRender: 'paperIdRelatedList' },
    },
    {
      title: '考试开始时间',
      dataIndex: 'startTime',
      width: '10%',
      scopedSlots: { customRender: 'startTime' },
    },
    {
      title: '考试结束时间',
      dataIndex: 'endTime',
      width: '10%',
      scopedSlots: { customRender: 'endTime' },
    },
    {
      title: '考试地点',
      dataIndex: 'address',
      width: '10%',
      scopedSlots: { customRender: 'address' },
    },
    {
      title: '状态',
      dataIndex: 'examStatus',
      width: '5%',
      scopedSlots: { customRender: 'examStatus' },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  }
  export default {
    name: 'TestManagePage',
    mixins: [JeecgListMixin],
    data() {
      this.cacheData = data.map(item => ({ ...item }));
      return {
        data,
        columns,
        editingKey: '',
        url: {
          list: window._CONFIG['examServiceURL'] + '/erp/exam/scheduleDetail/list',
          delete: window._CONFIG['examServiceURL'] + '/erp/exam/schedule/delete',
          deleteBatch: '/erp/student/deleteBatch',
          exportXlsUrl: 'erp/student/exportXls',
          importZIPUrl: 'erp/student/uplodLoadPics'
        },
        queryParam: {
          testPlanId: this.$route.query.testPlanId
        },
      };
    },
    methods: {
      handleChange(value, id, column) {
        const newData = [...this.dataSource];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          target[column] = value;
          this.dataSource = newData;
        }
      },
      edit(id) {
        const newData = [...this.dataSource];
        const target = newData.filter(item => id === item.id)[0];
        this.editingKey = id;
        if (target) {
          target.editable = true;
          this.dataSource = newData;
        }
      },
      save(id) {
        const newData = [...this.dataSource];
        const target = newData.filter(item => id === item.id)[0];
        if (target) {
          delete target.editable;
          let params = {
            id: target.id,
            examStatus:target.examStatus
          }
          testPlanApiList.editTestDetail(params).then(res => {
            if (res.code == 200 && !!res.success) {

              this.$message.success(res.message || '新增成功！')
              this.loadData();
            } else {
              this.$message.error(res.message || '获取工种等级列表失败！')
            }
          });
        }
        this.editingKey = '';
      },
      cancel(id) {
        const newData = [...this.dataSource];
        const target = newData.filter(item => id === item.id)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => id === item.id)[0]);
          delete target.editable;
          this.dataSource = newData;
        }
      },
    },
  };
</script>
<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>



<!--<script>-->
<!--    export default {-->
<!--      -->
<!--        created() {-->
<!--          this.getId();-->
<!--        },-->
<!--      methods: {-->
<!--          getId(){-->
<!--            console.log(this.$route.query.shopid);-->
<!--          }-->
<!--      }-->
<!--    }-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->