<template>
  <div class="search">
    <a-card style="margin-bottom: 10px">
      <p slot="title">
        <span>流程审批进度历史</span>
      </p>
      <a-row style="position: relative">
        <a-table :loading="loading" rowKey="id" :dataSource="data" :pagination="false" ref="table">
          <a-table-column title="#" width="50">
            <template slot-scope="t, r, i">
              <span> {{ i+1 }} </span>
            </template>
          </a-table-column>
          <a-table-column title="任务名称" dataIndex="name" width="150" align="center">
            <template slot-scope="t">
              <span> {{ t }} </span>
            </template>
          </a-table-column>

          <a-table-column title="处理人" dataIndex="assignees" width=150 align="center">
            <template slot-scope="t">
              <div v-if="t">
                <span v-for="item in t">
                  <span v-if="item.isExecutor" style="color: #00db00">{{ item.username }} </span>
                  <span v-else style="color: #999">{{ item.username }} </span>
                </span>
              </div>
            </template>
          </a-table-column>

<!--          <a-table-column title="处理人" dataIndex="assignees" width="150" align="center">
            <template slot-scope="t">
              <div v-if="t">
                &lt;!&ndash; v-for="(item,index) in assigneesList" :key="index" &ndash;&gt;
                  <j-ellipsis v-for="(item,index) in t" :key="index" :value="item.username" :length="10">
                  </j-ellipsis>
              </div>
            </template>
          </a-table-column>-->

          <a-table-column title="审批操作" dataIndex="deleteReason" width="150" align="center">
            <template slot-scope="t">
              <span v-if="t.toString().indexOf('通过') > -1" style="color: #00db00">{{ t }}</span>
              <span v-else-if="t.toString().indexOf('驳回') > -1" style="color: red">{{ t }}</span>
              <span v-else>{{ t }}</span>
            </template>
          </a-table-column>
          <a-table-column title="审批意见" dataIndex="comment" width="150" align="center">
            <template slot-scope="t">
              <span>{{ t }}</span>
            </template>
          </a-table-column>
          <a-table-column title="耗时" dataIndex="duration" width="150" align="center">
            <template slot-scope="t">
              <span>{{ millsToTime(t) }}</span>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" dataIndex="createTime" width="150" align="center">
            <template slot-scope="t">
              <span>{{ t }}</span>
            </template>
          </a-table-column>
          <a-table-column title="完成时间" dataIndex="endTime" width="150" align="center">
            <template slot-scope="t">
              <span>{{ t }}</span>
            </template>
          </a-table-column>
          <a-table-column title="状态" dataIndex="endTime" key="aaa" width="150" align="center">
            <template slot-scope="t">
              <span v-if="t" style="color: blue">已办理</span>
              <span v-else style="color: #999999">待处理</span>
            </template>
          </a-table-column>
        </a-table>
      </a-row>
    </a-card>

    <a-tabs type="card" @change="callback">
      <a-tab-pane key="1" tab="实时流程图">
        <a-card>
          <!--<p slot="title">
            <span>实时流程图</span>
          </p>-->
          <a-row style="position: relative">
            <img :src="imgUrl" />
            <a-spin size="large" fix v-if="loadingImg"></a-spin>
          </a-row>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="2" tab="表单数据" v-if="lcModa">
        <a-card>
          <!--流程表单-->
          <component
            :disabled="lcModa.disabled"
            :is="lcModa.formComponent"
            :processData="lcModa.processData"
            :isNew="lcModa.isNew"
            :task="lcModa.isTask"
            @afterSubmit="afterSub"
            @passTask="pass(lcModa.processData)"
            @backTask="back(lcModa.processData)"
            @close=";(lcModa.visible = false), (lcModa.disabled = false)"
          ></component>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { activitiMixin } from '@/views/activiti/mixins/activitiMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'

let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
export default {
  name: 'historic_detail',
  mixins: [activitiMixin, JeecgListMixin],
  components: { JEllipsis },
  props: {
    /**/
    tableId: {
      type: String,
      default: '',
      required: true,
    },
    tableName: {
      type: String,
      default: '',
      required: true,
    },
    lcModa: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      url: {
        historicFlow: '/erp/billRefund/historicFlow/',
        getHighlightImg: `${window._CONFIG['domianURL']}/erp/billRefund/getHighlightImg/`,
      },
      type: 0,
      loading: false, // 表单加载状态
      loadingImg: false,
      data: [],
      assigneesList:[],
      id: '',
      imgUrl: '',
      backRoute: '',
    }
  },
  created() {
    this.init()
  },
  watch: {
    tableId: function (newval, oldName) {
      this.init()
    },
  },
  methods: {
    loadData() {},
    init() {
      this.id = this.tableId
      this.imgUrl = this.url.getHighlightImg + this.id + '?time=' + new Date() + '&tableName=' + this.tableName
      this.getDataList()
    },
    getDataList() {
      let usernameStr=''
      let usernameStrList=[]
      this.assigneesList=[]
      this.loading = true
      this.getAction(this.url.historicFlow + this.id + '?tableName=' + this.tableName).then((res) => {
        console.log(res.result)
        this.loading = false
        if (res.success) {
          this.data = res.result
          // for (let i = 0; i < this.data.length; i++) {
          //   console.log(this.data[i].assignees);
          //   usernameStrList=[]
          //   for (let j = 0; j < this.data[i].assignees.length; j++) {
          //     console.log(this.data[i].assignees[j].username);
          //     usernameStrList.push(this.data[i].assignees[j].username)
          //     usernameStr=usernameStrList.toString()
          //   }
          //   console.log(usernameStrList);
          //   console.log(usernameStr);
          //   let obj={
          //     username:usernameStr
          //   }
          //   this.assigneesList.push(obj)
          // }
          // console.log(this.assigneesList);
          if (!res.result || res.result.length == 0) {
            this.$message.info('未找到该记录审批历史数据,历史数据可能已被删除')
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      // this.loadData();
    },
    callback(key) {},
    afterSub() {},
    pass(v) {
      this.$emit('passTask', v)
    },
    back(v) {
      this.$emit('backTask', v)
    },
  },
}
</script>
<style lang="less">
.ant-modal-body {
  .search {
    .ant-card-bordered {
      .ant-card-body {
        .ant-row {
          .ant-table-wrapper {
            .ant-spin-nested-loading {
              .ant-spin-container {
                .ant-table-default {
                  .ant-table-content {
                    .ant-table-body {
                      .ant-table-thead {
                        .ant-table-row-cell-break-word:nth-child(3) {
                          width: 280px;
                        }
                        .ant-table-row-cell-break-word:nth-child(5) {
                          width: 280px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>