<script setup lang="ts">
    const props = defineProps<{
        activeMenu: string
    }>()

    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'

    const emit = defineEmits<{
        change: [menu: string]
    }>()

    const showProfile = ref(false)
    const auth = useAuthStore()
    const router = useRouter()

    const maskedToken = computed(() => {
        const raw: any = auth.token
        const t = raw && (raw.value ?? raw)
        if (!t) return '—'
        if (t.length <= 12) return t
        return `${t.slice(0, 6)}...${t.slice(-4)}`
    })

    function openProfile() {
        showProfile.value = true
    }

    function closeProfile() {
        showProfile.value = false
    }

    function doLogout() {
        auth.logout()
        closeProfile()
        router.replace('/login')
    }

    const menus = [
        { key: 'chat', label: '聊' },
        { key: 'contacts', label: '人' },
        { key: 'discover', label: '发' },
        { key: 'settings', label: '设' },
    ]

    function selectMenu(menu: string) {
        emit('change', menu)
    }
</script>

<template>
    <aside class="sidebar">
        <div class="user-badge">W</div>

        <nav class="menu-list">
            <button v-for="item in menus" :key="item.key" class="menu-btn"
                :class="{ active: props.activeMenu === item.key }" @click="selectMenu(item.key)">
                {{ item.label }}
            </button>
        </nav>

        <button class="user-badge mini" @click="openProfile">我</button>
    </aside>

    <div v-if="showProfile" class="profile-overlay" @click.self="closeProfile">
        <div class="profile-card">
            <header class="profile-head">
                <div class="badge">{{ auth.nickname ?? auth.username ?? (auth.erp ?? 'U') }}</div>
                <div class="meta">
                    <div class="name">{{ auth.nickname ?? auth.username ?? (auth.erp ?? '未登录') }}</div>
                    <div class="sub">个人信息</div>
                </div>
            </header>

            <section class="profile-body">
                <dl>
                    <dt>ERP</dt>
                    <dd>{{ auth.erp ?? '—' }}</dd>

                    <dt>手机号</dt>
                    <dd>{{ auth.phone ?? '—' }}</dd>

                    <dt>邮箱</dt>
                    <dd>{{ auth.email ?? '—' }}</dd>

                    <dt>用户名</dt>
                    <dd>{{ auth.username ?? '—' }}</dd>

                    <dt>昵称</dt>
                    <dd>{{ auth.nickname ?? '—' }}</dd>

                    <dt>简介</dt>
                    <dd>{{ auth.bio ?? '—' }}</dd>

                    <dt>Token</dt>
                    <dd class="token">{{ maskedToken }}</dd>
                </dl>
            </section>

            <footer class="profile-actions">
                <button class="logout" @click="doLogout">登出</button>
                <button class="close-btn" @click="closeProfile">关闭</button>
            </footer>
        </div>
    </div>
</template>

<style scoped>
    .sidebar {
        width: 72px;
        min-width: 72px;
        background: #20262d;
        color: #d8dee7;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 14px 0;
        gap: 14px;
        overflow-y: auto;
    }

    .user-badge {
        width: 40px;
        min-width: 40px;
        height: 40px;
        min-height: 40px;
        border-radius: 12px;
        border: 0;
        background: linear-gradient(135deg, #53d769, #2ca855);
        color: #fff;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        cursor: default;
    }

    .user-badge.mini {
        margin-top: auto;
        background: #3b4450;
    }

    .menu-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .menu-btn {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: #c8d0da;
        font-size: 14px;
        cursor: pointer;
    }

    .menu-btn.active {
        background: #2d3742;
        color: #fff;
    }

    /* profile modal */
    .profile-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5, 8, 10, 0.45);
        z-index: 1200;
    }

    .profile-card {
        width: 320px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(6, 12, 10, 0.15);
        overflow: hidden;
    }

    .profile-head {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 16px
    }

    .profile-head .badge {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        background: linear-gradient(135deg, #53d769, #2ca855);
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 700
    }

    .profile-head .meta .name {
        font-weight: 700
    }

    .profile-head .meta .sub {
        font-size: 12px;
        color: #7b8a90
    }

    .profile-body {
        padding: 12px 16px
    }

    .profile-body dl {
        margin: 0
    }

    .profile-body dt {
        font-size: 12px;
        color: #7b8a90
    }

    .profile-body dd {
        margin: 6px 0 12px;
        font-weight: 600
    }

    .profile-body .token {
        font-family: monospace;
        font-size: 13px;
        color: #334
    }

    .profile-actions {
        display: flex;
        gap: 8px;
        padding: 12px 16px;
        justify-content: flex-end
    }

    .profile-actions .logout {
        background: #e74c3c;
        color: #fff;
        border: 0;
        padding: 8px 12px;
        border-radius: 8px
    }

    .profile-actions .close-btn {
        background: #eef2f3;
        border: 0;
        padding: 8px 12px;
        border-radius: 8px
    }
</style>
