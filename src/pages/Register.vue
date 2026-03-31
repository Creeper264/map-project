<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h1>注册账户</h1>
        <p>创建您的安全管理系统账户</p>
      </div>
      <a-form
        :model="formData"
        :rules="rules"
        @finish="handleRegister"
        @finishFailed="handleRegisterFailed"
        layout="vertical"
        class="register-form"
      >
        <a-form-item name="username" label="用户名">
          <a-input
            v-model:value="formData.username"
            placeholder="请输入用户名（3-20个字符）"
            size="large"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="phone" label="手机号">
          <a-input
            v-model:value="formData.phone"
            placeholder="请输入手机号"
            size="large"
            :maxlength="11"
          >
            <template #prefix>
              <MobileOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="code" label="验证码">
          <a-input-group compact>
            <a-input
              v-model:value="formData.code"
              placeholder="请输入验证码"
              size="large"
              style="width: calc(100% - 120px)"
              :maxlength="6"
            />
            <a-button
              size="large"
              :disabled="codeCountdown > 0"
              @click="sendCode"
              :loading="codeLoading"
              style="width: 120px"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}秒` : '发送验证码' }}
            </a-button>
          </a-input-group>
        </a-form-item>

        <a-form-item name="password" label="密码">
          <a-input-password
            v-model:value="formData.password"
            placeholder="请输入密码（6-20个字符）"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="confirmPassword" label="确认密码">
          <a-input-password
            v-model:value="formData.confirmPassword"
            placeholder="请再次输入密码"
            size="large"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            注册
          </a-button>
        </a-form-item>

        <div class="register-footer">
          <a href="/login">已有账号？立即登录</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const codeLoading = ref(false)
const codeCountdown = ref(0)
const generatedCode = ref('')

const formData = reactive({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
})

// 生成6位随机验证码
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 发送验证码
const sendCode = async () => {
  if (!formData.phone) {
    message.warning('请先输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    message.error('请输入正确的手机号')
    return
  }

  codeLoading.value = true
  
  try {
    // 模拟发送验证码API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成验证码（实际应该由后端生成并发送到手机）
    generatedCode.value = generateCode()
    
    message.success(`验证码已发送到 ${formData.phone}，验证码：${generatedCode.value}（演示用）`)
    
    // 开始倒计时
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    message.error('发送验证码失败，请稍后重试')
  } finally {
    codeLoading.value = false
  }
}

const validateConfirmPassword = (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请再次输入密码')
  }
  if (value !== formData.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  // 验证验证码
  if (formData.code !== generatedCode.value) {
    message.error('验证码错误，请重新输入')
    return
  }

  loading.value = true
  try {
    // 模拟API请求延时
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = userStore.register(
      formData.username,
      formData.phone,
      formData.password,
      formData.code
    )
    
    if (success) {
      message.success('注册成功！')
      
      // 延时后显示弹窗
      setTimeout(() => {
        Modal.success({
          title: '注册成功',
          content: `恭喜您，${formData.username}！账户注册成功，正在跳转到系统首页...`,
          onOk: () => {
            router.push('/dashboard')
          },
        })
      }, 500)
    } else {
      message.error('注册失败，请稍后重试')
    }
  } catch (error) {
    message.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleRegisterFailed = () => {
  message.error('请填写完整的注册信息')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 450px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.register-form {
  margin-top: 24px;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
}

.register-footer a {
  color: #1890ff;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>

