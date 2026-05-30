<script setup lang="ts">
    import { computed, ref } from 'vue'
    import type { ConversationPreview } from '../../types/types'

    const props = defineProps<{
        conversations: ConversationPreview[]
        activeConversationId: number
    }>()

    const emit = defineEmits<{
        select: [id: number]
    }>()

    const keyword = ref('')

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
            <input v-model="keyword" type="text" placeholder="搜索" />
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
        padding: 14px;
    }

    input {
        width: 100%;
        height: 34px;
        border: 1px solid #d4dbe3;
        border-radius: 8px;
        padding: 0 10px;
        font-size: 14px;
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
        border-radius: 12px;
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

    @media (max-width: 900px) {
        /* .conversation-list {
            width: 100%;
            border-right: 0;
        } */
    }
</style>
