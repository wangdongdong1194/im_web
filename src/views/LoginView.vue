<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const auth = useAuthStore()

    const erp = ref('')
    const password = ref('')
    const erpInput = ref<HTMLInputElement | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    onMounted(() => {
        if (auth.isLoggedIn) {
            router.replace('/')
            return
        }
        // focus ERP field on mount
        erpInput.value?.focus()
    })

    async function submit() {
        error.value = null
        const e = erp.value.trim()
        const p = password.value
        if (!e || !p) {
            error.value = '请输入 ERP 和密码'
            return
        }
        loading.value = true
        try {
            await auth.login(e, p)
            router.replace('/')
        } catch (err: any) {
            error.value = err?.message || '登录失败'
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <section class="login-page">
        <div class="card">
            <header class="card-head">
                <div class="logo">IM</div>
                <h2>登录</h2>
            </header>

            <form class="form" @submit.prevent="submit">
                <label>
                    <span class="label-text">ERP</span>
                    <input v-model="erp" ref="erpInput" placeholder="ERP 帐号" autocomplete="username" />
                </label>

                <label>
                    <span class="label-text">密码</span>
                    <input v-model="password" type="password" placeholder="密码" autocomplete="current-password"
                        @keydown.enter.prevent="submit" />
                </label>

                <div class="actions">
                    <button type="submit" :disabled="loading">
                        <span v-if="loading" class="spinner" aria-hidden></span>
                        <span>{{ loading ? '登录中...' : '登录' }}</span>
                    </button>
                </div>

                <div v-if="error" class="error">{{ error }}</div>

                <div class="hint">
                    还没有帐号？ <router-link to="/register">去注册</router-link>
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped>
    .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 32px;
        background: linear-gradient(180deg, #f6fbf8 0%, #eef6f1 100%);
    }

    .card {
        width: 100%;
        max-width: 420px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(22, 31, 23, 0.06);
        padding: 20px;
    }

    .card-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }

    .logo {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        background: #2ea043;
        color: #fff;
        display: inline-grid;
        place-items: center;
        font-weight: 700;
    }

    h2 {
        margin: 0;
        font-size: 20px
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 12px
    }

    .form label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px
    }

    .label-text {
        font-size: 13px;
        color: #535f63
    }

    .form input {
        padding: 10px 12px;
        border: 1px solid #e6eae5;
        border-radius: 8px;
        font-size: 14px
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 4px
    }

    button {
        padding: 10px 16px;
        border-radius: 8px;
        border: 0;
        background: #2ea043;
        color: #fff;
        font-weight: 600;
        cursor: pointer
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed
    }

    .error {
        color: #d93025;
        margin-top: 6px;
        font-size: 13px
    }

    .spinner {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-right-color: rgba(255, 255, 255, 0.9);
        margin-right: 8px;
        animation: spin 1s linear infinite;
        vertical-align: middle
    }

    .hint {
        margin-top: 8px;
        font-size: 13px;
        color: #58656a
    }

    @keyframes spin {
        to {
            transform: rotate(360deg)
        }
    }

    @media (max-width: 480px) {
        .card {
            padding: 16px
        }

        .form input {
            font-size: 14px
        }
    }
</style>
