<script setup lang="ts">
    import { computed, ref } from 'vue'
    import type { ConversationPreview } from '../../types/types'

    const props = defineProps<{
        conversations: ConversationPreview[]
        activeConversationId: number
    }>()

    const emit = defineEmits<{
        select: [id: number]
        'add-friend': [friend: { erp: string; name?: string; avatar?: string }]
    }>()

    const keyword = ref('')

    // add-friend modal state
    const showAddModal = ref(false)
    const friendQuery = ref('')
    const friendResults = ref<Array<{ erp: string; name: string; avatar?: string }>>([])

    // demo users for search (replace with API call if available)
    const demoUsers = [
        { erp: 'u1001', name: '小明', avatar: '明' },
        { erp: 'u1002', name: '小红', avatar: '红' },
        { erp: 'u1003', name: '小李', avatar: '李' },
        { erp: 'u1004', name: '前端组', avatar: '前' },
    ]

    function openAddFriendModal() {
        friendQuery.value = ''
        friendResults.value = []
        showAddModal.value = true
        // focus handled by input attrs in modal
    }

    function closeAddFriendModal() {
        showAddModal.value = false
    }

    function searchFriends() {
        const q = friendQuery.value.trim().toLowerCase()
        if (!q) {
            friendResults.value = []
            return
        }
        // simple local filter; replace with API call as needed
        friendResults.value = demoUsers.filter((u) => u.erp.includes(q) || u.name.toLowerCase().includes(q))
    }

    function confirmAddFriend(item: { erp: string; name: string; avatar?: string }) {
        emit('add-friend', item)
        closeAddFriendModal()
    }

    const filteredConversations = computed(() => {
        const text = keyword.value.trim().toLowerCase()
        if (!text) {
            return props.conversations
        }

        return props.conversations.filter((item) => {
            return item.name.toLowerCase().includes(text) || item.lastMessage.toLowerCase().includes(text)
        })
    })
</script>

<template>
    <section class="conversation-list">
        <div class="panel-header">
            <div class="search-row">
                <input v-model="keyword" type="text" placeholder="搜索" />
                <button class="add-friend" title="新增好友" @click="openAddFriendModal">＋</button>
            </div>
        </div>

        <!-- Add Friend Modal -->
        <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddFriendModal">
            <div class="modal">
                <header class="modal-head">
                    <h3>添加好友</h3>
                    <button class="close" @click="closeAddFriendModal">×</button>
                </header>

                <div class="modal-body">
                    <label class="field">
                        <span>输入 ERP 或姓名或手机号</span>
                        <input v-model="friendQuery" @input="searchFriends" placeholder="例如: u1001 或 小明 或 132xxxxxxx" />
                    </label>

                    <div class="results">
                        <p v-if="friendResults.length === 0" class="hint">未找到用户，尝试更精确的关键词</p>
                        <ul v-else>
                            <li v-for="item in friendResults" :key="item.erp">
                                <div class="r-left">
                                    <div class="avatar">{{ item.avatar ?? item.name.charAt(0) }}</div>
                                </div>
                                <div class="r-mid">
                                    <div class="name">{{ item.name }}</div>
                                    <div class="erp">{{ item.erp }}</div>
                                </div>
                                <div class="r-right">
                                    <button class="confirm" @click="confirmAddFriend(item)">添加</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <ul>
            <li v-for="item in filteredConversations" :key="item.id"
                :class="{ active: item.id === props.activeConversationId }" @click="emit('select', item.id)">
                <div class="avatar">{{ item.avatar }}</div>
                <div class="meta">
                    <div class="name-row">
                        <strong>{{ item.name }}</strong>
                        <span>{{ item.lastTime }}</span>
                    </div>
                    <p>{{ item.lastMessage }}</p>
                </div>
                <span v-if="item.unread > 0" class="unread">{{ item.unread }}</span>
            </li>
        </ul>
    </section>
</template>

<style scoped>
    .conversation-list {
        width: 300px;
        min-width: 300px;
        border-right: 1px solid #e9edf2;
        background: #f7f9fb;
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        padding: 12px 14px;
    }

    .search-row {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    input {
        flex: 1;
        height: 36px;
        border: 1px solid #d4dbe3;
        border-radius: 10px;
        padding: 0 12px;
        font-size: 14px;
        background: #fff;
        box-shadow: inset 0 1px 2px rgba(12, 18, 20, 0.02);
    }

    .add-friend {
        white-space: nowrap;
        background: linear-gradient(180deg, #2ea043, #248836);
        color: #fff;
        border: none;
        padding: 8px 10px;
        border-radius: 10px;
        font-size: 13px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(46, 160, 67, 0.12);
        transform: translateY(-1px);
    }

    .add-friend:active {
        box-shadow: 0 1px 3px rgba(46, 160, 67, 0.12);
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow: auto;
    }

    li {
        padding: 12px 14px;
        display: grid;
        grid-template-columns: 44px 1fr auto;
        gap: 10px;
        border-top: 1px solid #eef1f5;
        cursor: pointer;
    }

    li.active {
        background: #eaf5eb;
    }

    .avatar {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: #d6e5d8;
        display: grid;
        place-items: center;
        font-weight: 700;
        color: #2f5940;
    }

    .meta {
        min-width: 0;
    }

    .name-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;
    }

    .name-row span {
        color: #8a97a5;
        font-size: 12px;
    }

    p {
        margin: 0;
        font-size: 13px;
        color: #566475;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .unread {
        height: 20px;
        min-width: 20px;
        border-radius: 999px;
        background: #e74c3c;
        color: #fff;
        font-size: 12px;
        display: grid;
        place-items: center;
        padding: 0 6px;
    }

    /* small visual polish when hovering a conversation */
    li:hover {
        background: #f0f6f2;
    }

    /* Modal styles */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 12, 10, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1200;
    }

    .modal {
        width: 420px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(6, 12, 10, 0.2);
        overflow: hidden;
    }

    .modal-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f1f3f5;
    }

    .modal-head h3 {
        margin: 0;
        font-size: 16px;
    }

    .modal-head .close {
        border: none;
        background: transparent;
        font-size: 18px;
        cursor: pointer;
    }

    .modal-body {
        padding: 12px 16px 18px;
    }

    .modal-body .field input {
        width: 100%;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid #e6eaec;
        margin-top: 8px;
    }

    .results {
        margin-top: 12px
    }

    .results ul {
        list-style: none;
        padding: 0;
        margin: 0
    }

    .results li {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 8px 0;
        border-top: 1px solid #f3f5f6
    }

    .results .r-left .avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #eef6ef;
        display: grid;
        place-items: center
    }

    .results .name {
        font-weight: 600
    }

    .results .erp {
        font-size: 12px;
        color: #88939a
    }

    .confirm {
        background: #2ea043;
        color: #fff;
        border: none;
        padding: 6px 10px;
        border-radius: 8px;
        cursor: pointer
    }

    .hint {
        color: #7d8b90;
        font-size: 13px
    }

    @media (max-width: 900px) {
        /* .conversation-list {
            width: 100%;
            border-right: 0;
        } */
    }
</style>
