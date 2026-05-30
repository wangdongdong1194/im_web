<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const router = useRouter()
    const auth = useAuthStore()

    const erp = ref('')
    const username = ref('')
    const password = ref('')
    const phone = ref('')
    const confirm = ref('')
    const loading = ref(false)
    const error = ref<string | null>(null)
    const erpInput = ref<HTMLInputElement | null>(null)

    const passwordsMatch = computed(() => password.value === confirm.value)
    const showPasswordMismatch = computed(() => confirm.value.length > 0 && !passwordsMatch.value)

    onMounted(() => {
        if (auth.isLoggedIn) {
            router.replace('/')
            return
        }
        erpInput.value?.focus()
    })

    async function submit() {
        error.value = null
        const e = erp.value.trim()
        const p = password.value
        const c = confirm.value
        const u = username.value.trim()
        const ph = phone.value.trim()
        if (!e || !p || !u || !ph || !c) {
            error.value = '请输入完整的注册信息'
            return
        }
        if (!passwordsMatch.value) {
            error.value = '两次输入的密码不一致'
            return
        }

        loading.value = true
        try {
            // use auth.register which sets token if backend returns it
            await auth.register(e, p, u, ph)
            // if backend didn't return token, try to login automatically
            if (!auth.isLoggedIn) {
                try {
                    await auth.login(e, p)
                } catch {
                    // ignore login error; route guard will redirect to /login if needed
                }
            }
            router.replace('/')
        } catch (err: any) {
            error.value = err?.message || '注册失败'
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
                <h2>注册</h2>
            </header>

            <form class="form" @submit.prevent="submit">
                <label>
                    <span class="label-text">ERP</span>
                    <input v-model="erp" ref="erpInput" placeholder="ERP 帐号" autocomplete="username" />
                </label>

                <label>
                    <span class="label-text">昵称</span>
                    <input v-model="username" placeholder="显示名" />
                </label>

                <label>
                    <span class="label-text">手机号</span>
                    <input v-model="phone" placeholder="手机号" />
                </label>

                <label>
                    <span class="label-text">密码</span>
                    <input v-model="password" type="password" placeholder="密码" autocomplete="new-password" />
                </label>

                <label>
                    <span class="label-text">确认密码</span>
                    <input v-model="confirm" type="password" placeholder="再次输入密码" @keydown.enter.prevent="submit"
                        :class="{ invalid: showPasswordMismatch }" />
                    <div v-if="showPasswordMismatch" class="field-error">两次输入的密码不一致</div>
                </label>

                <div class="actions">
                    <button type="submit" :disabled="loading || !passwordsMatch">
                        <span v-if="loading" class="spinner" aria-hidden></span>
                        <span>{{ loading ? '注册中...' : '注册并登录' }}</span>
                    </button>
                </div>

                <div v-if="error" class="error">{{ error }}</div>

                <div class="hint">
                    已有帐号？ <router-link to="/login">去登录</router-link>
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped>

    /* reuse styles from LoginView */
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
        padding: 20px
    }

    .card-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px
    }

    .logo {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        background: #2ea043;
        color: #fff;
        display: inline-grid;
        place-items: center;
        font-weight: 700
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

    .field-error {
        color: #d93025;
        margin-top: 6px;
        font-size: 13px
    }

    .invalid {
        border-color: #d93025
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

    @keyframes spin {
        to {
            transform: rotate(360deg)
        }
    }

    .hint {
        margin-top: 8px;
        font-size: 13px;
        color: #58656a
    }

    @media (max-width:480px) {
        .card {
            padding: 16px
        }

        .form input {
            font-size: 14px
        }
    }
</style>
