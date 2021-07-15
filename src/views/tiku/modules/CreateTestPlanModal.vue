<template>
  <a-modal
    :title="title"
    width="60%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <!-- 试题信息 -->
    <a-form-model
      ref="ruleForm"
      class="plan"
      :model="form"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 21 }"
    >
      <a-form-model-item label="计划名称" prop="scheduleName">
        <a-input placeholder="请输入计划名称" v-model.trim="form.scheduleName" />
      </a-form-model-item>
      <a-form-model-item label="项目类型" prop="projectType">
        <a-select placeholder="请选择项目类型" v-model="form.projectType" @change="clearFromDetailList">
          <a-select-option
            v-for="item in projectTypeList.slice(1)"
            :key="item.itemValue"
            :disabled="item.itemValue == 3"
          >{{ item.itemText }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="考试类型" prop="examType">
        <a-radio-group v-model="form.examType" @change="clearFromDetailList">
          <a-radio value="1">
            正式考试
          </a-radio>
          <a-radio value="2">
            模拟考试
          </a-radio>
          <a-radio value="3">
            单元考试
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="考试形式" prop="examMode">
        <a-radio-group v-model="form.examMode" @change="clearFromDetailList">
          <a-radio value="1">
            线上考试
          </a-radio>
          <a-radio value="2">
            线下考试
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="试题要求" prop="questionScope">
        <a-radio-group v-model="form.questionScope" @change="clearFromDetailList">
          <a-radio value="4">
            无
          </a-radio>
          <a-radio value="1">
            半年
          </a-radio>
          <a-radio value="2">
            一年
          </a-radio>
          <a-radio value="3">
            两年
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <a-form-model-item
        v-for="(domain, index) in form.detailList"
        :label-col="{ span: index === 0 ? 3: 0 }"
        :wrapper-col="{ span: 21, offset:  index === 0 ? 0: 3}"
        :key="domain.key"
        v-bind="index === 0 ? formItemLayout : {}"
        :label="index === 0 ? '考试安排' : ''"
        :prop="'detailList.' + index + '.workType'"
        :rules="{
        required: false,
        message: 'domain can not be null',
        trigger: 'blur',
      }"
      >
        <a-row>
          <a-col :span="12">
            <j-select-work-type-for-tiku
              style="width: 100%;"
              placeholder="请选择工种类型"
              :multiple="false"
              v-model.trim="domain.workType"
              @change="getWorklevelTypeList('',domain)"
            />
          </a-col>
          <a-col :span="12">
            <a-select  style="width: 80%;margin-right: 20px" placeholder="请选择工种等级" v-model="domain.workTypeId" @change="setWorkType(domain)">
              <a-select-option v-for="item in domain.worktypeLevelTypeList" :key="item.id">{{ item.workLevel }}</a-select-option>
            </a-select>
            <a-popconfirm
              v-if="form.detailList.length > 0"
              title="确定要删除吗?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="removeDomain(domain)"
              @cancel="cancel"
            >
              <a-button  type="primary" icon="minus-circle-o"/>
            </a-popconfirm>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="7">
            <j-select-paper
              v-if="!!domain.workTypeId"
              style="width: 100%;"
              placeholder="请选择试卷"
              :multiple="false"
              :projectType="form.projectType"
              :paperType="form.examType"
              :paperMode="''"
              :paperScope="form.questionScope"
              :workTypeId="domain.workTypeId"
              v-model.trim="domain.paperId"
            />
          </a-col>
          <a-col :span="10">
            <TikuDatePicker
              style="width: 100%;"
              :domain="domain"
            ></TikuDatePicker>
          </a-col>
          <a-col :span="6">
            <a-input  style="width: 100%;margin-top: 4px;" v-if="!!domain.workTypeId" placeholder="请输入考试地点" v-model.trim="domain.address" />
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="addDomain">
          <a-icon type="plus" /> 新增
        </a-button>
      </a-form-model-item>
      <a-form-model-item>
        <div style="color: #c8cbcf">特别提示：</div>
        <div style="color: #c8cbcf">1. 考试安排未开始时，删除考试安排或者计划，试卷中试题被视为未使用。</div>
        <div style="color: #c8cbcf">2. 考试安排已开始后，试卷中试题被视为已使用；支持通过编辑考试时间，调整考试状态和时间记录。</div>
        <div style="color: #c8cbcf">3. 考试安排已开始后，试卷中试题被视为已使用；编辑、删除考试安排或者计划，试题依然被视为已经使用。</div>
      </a-form-model-item>
    </a-form-model>

    <a-modal
      title="更改提示"
      :visible="changeMsgVisible"
      :confirm-loading="confirmLoading"
      @ok="clearDetailList"
      @cancel="handleDetailList"
    >
      <p>更改后，考试安排将被全部清空，是否确定更改操作？</p>
    </a-modal>
  </a-modal>
</template>

<script>
  import _ from 'lodash'
  import moment from 'moment'
  import { tikuApiList,testPlanApiList } from '@/api/api'
  import mixin_tiku from '../mixins/TikuListMixin'
  import TikuDatePicker from '../components/TikuDatePicker'
  import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
  import JSelectPaper from '@/components/jeecgbiz/JSelectPaper'


  export default {
    name: 'CreateTestPlanModal', //创建考试计划弹框
    mixins: [mixin_tiku],
    components: { JSelectWorkTypeForTiku,JSelectPaper,TikuDatePicker },
    data() {
      let that = this
      return {
        title: '创建考试计划',
        pageModalType: 'add',
        visible: false,
        confirmLoading: false,
        form: {
          id:'',
          scheduleName:'',
          projectType: undefined, //项目类型
          examType:undefined,
          examMode:undefined,
          questionScope:undefined,
          workType: undefined, //工种类型
          workTypeId: undefined, //工种等级
          detailList:[]
        },

        rules: {
          scheduleName: [{ required: true, message: '计划名称不能为空', trigger: 'change' }],
          projectType: [{ required: true, message: '项目类型不能为空', trigger: 'change' }],
          examType: [{ required: true, message: '考试类型不能为空', trigger: 'change' }],
          examMode: [{ required: true, message: '考试形式不能为空', trigger: 'change' }],
          questionScope: [{ required: true, message: '试题范围不能为空', trigger: 'change' }],
        },
        changeMsgVisible:false,
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        },
        formItemLayoutWithOutLabel: {
          wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
          },
        }
      }
    },
    created() {},
    computed: {},
    methods: {
      closeModal() {
        this.visible = false
      },
      showModal() {
        this.visible = true
      },
      handleCancel() {
        this.closeModal()
        this.doResetForm()
      },
      handleOk() {
        this.doFormSubmit()
      },
      add() {
        this.pageModalType = 'add'
        this.doResetForm()
        this.showModal()
      },
      edit(record) {
        this.pageModalType ='edit'
        this.showModal()
        console.log("record="+record)
        //初始化form
        this.doResetForm()
        this.form.id=record.id;
        this.form.scheduleName=record.scheduleName;
        this.form.projectType=record.projectType.toString();
        this.form.examType=record.examType.toString();
        this.form.examMode=record.examMode.toString();
        this.form.questionScope=record.questionScope.toString();


        if(record.detailList && record.detailList.length>0){
          for (let i=0;i<record.detailList.length;i++){
            let detail = record.detailList[i];

            let domian={
              id: detail.id,
              workType: detail.workTypeName,
              workTypeId: detail.workTypeId,
              paperId:detail.paperId,
              key: Date.now(),
              startTime: (detail.startTime==undefined || detail.startTime=='')? undefined:moment(detail.startTime).format(),
              endTime: (detail.endTime==undefined || detail.endTime=='')? undefined:moment(detail.endTime).format(),
              address:detail.address,
              endOpen: false,
              worktypeLevelTypeList:[]
            }
            if(domian.workTypeId != undefined && domian.workTypeId != ''){
              this.getWorklevelTypeList('edit',domian);
            }
            this.form.detailList.push(domian);
          }
        }
      },
      doResetForm() {
        this.form.id=undefined;
        this.form.scheduleName=undefined;
        this.form.projectType=undefined;
        this.form.examType=undefined;
        this.form.examMode=undefined;
        this.form.questionScope=undefined;
        this.form.detailList=[];
      },
      doFormSubmit() {
        this.$refs.ruleForm.validate(valid => {
          console.log("doFormSubmit--valid"+valid)
          if (valid) {
            this.doSendFormDataSubmit()
          } else {
            this.$message.warning('验证没通过！')
            return false
          }
        })
      },
      doSendFormDataSubmit() {
        //判断考试安排是否为空
        let opts = {}
        Object.assign(opts, this.form);
        this.tranDateFormat(opts);


        if(this.pageModalType=='add'){
          testPlanApiList.addTestPlan(opts).then(res => {
            if (res.code == 200 && !!res.success) {
              this.$message.success(res.message || '新增成功！')
              this.closeModal();
              this.$emit('ok')
            } else {
              this.$message.error(res.message || '新增失败！')
            }
          })
        }else if(this.pageModalType=='edit'){
          testPlanApiList.editTestPlan(opts).then(res => {
            if (res.code == 200 && !!res.success) {
              this.$message.success(res.message || '编辑成功！')
              this.closeModal();
              this.$emit('ok')
            } else {
              this.$message.error(res.message || '新增失败！')
            }
          })
        }
      },

      tranDateFormat(record){
        if(record.detailList && record.detailList.length>0){
          for (let i=0;i<record.detailList.length;i++){
            let startTime = record.detailList[i].startTime
            let endTime = record.detailList[i].endTime
            if(startTime){
              record.detailList[i].startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }

            if(endTime){
              record.detailList[i].endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        }
      },
      getWorklevelTypeList(operation,domain) {
        let opts = {
          workType: domain.workType
        }
        tikuApiList.getWorkLevelByWorkType(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            domain.worktypeLevelTypeList = res.result
            if(operation!='edit'){
              //非编辑初始化工种级别时，需要重置workTypeId
              domain.workTypeId=undefined;
            }
          } else {
            this.$message.error(res.message || '获取工种等级列表失败！')
          }
        })
      },

      setWorkType(domain) {
        console.log('setWorkType----domain.workType='+domain.workType);
        console.log('setWorkType----domain.workTypeId='+domain.workTypeId);
        // domain.workTypeId=undefined;
      },

      removeDomain(item) {
        let index = this.form.detailList.indexOf(item);
        if (index !== -1) {
          this.form.detailList.splice(index, 1);
        }
      },
      addDomain() {
        this.form.detailList.push({
          id:'',
          workType: '',
          workTypeId: '',
          paperId:'',
          key: Date.now(),
          startTime:undefined,
          endTime:undefined,
          address:undefined,
          worktypeLevelTypeList:[],

          startTime: null,
          endTime: null,
          endOpen: false
        });
      },

      handleStartOpenChange(domain) {
        if (domain.startTime) {
          domain.endOpen = true;
        }
      },
      handleEndOpenChange(domain) {
        domain.endOpen = false;
      },
      clearFromDetailList(){
        if(this.form.detailList == [] || this.form.detailList == undefined || this.form.detailList.length == 0){
        }else{
          this.changeMsgVisible = true
        }
      },
      clearDetailList(){
        this.form.detailList=[];
        this.handleDetailList();
      },
      // 关闭
      handleDetailList() {
        this.changeMsgVisible = false
      },
    },
    mounted() {}
  }
</script>

<style lang="less" scoped>




  /*.dynamic-delete-button {*/
  /*  cursor: pointer;*/
  /*  position: relative;*/
  /*  top: 4px;*/
  /*  font-size: 24px;*/
  /*  color: #999;*/
  /*  transition: all 0.3s;*/
  /*}*/
  /*.dynamic-delete-button:hover {*/
  /*  color: #777;*/
  /*}*/
  /*.dynamic-delete-button[disabled] {*/
  /*  cursor: not-allowed;*/
  /*  opacity: 0.5;*/
  /*}*/
</style>
