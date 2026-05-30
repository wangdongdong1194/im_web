<script setup lang="ts">
    const props = defineProps<{
        activeMenu: string
    }>()

    const emit = defineEmits<{
        change: [menu: string]
    }>()

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

        <button class="user-badge mini">我</button>
    </aside>
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
</style>
