<script setup lang="ts">
    import { computed, ref } from 'vue'
    import WechatChatWindow from '@/components/wechat/WechatChatWindow.vue'
    import WechatContactsPanel from '@/components/wechat/WechatContactsPanel.vue'
    import WechatConversationList from '@/components/wechat/WechatConversationList.vue'
    import WechatSidebar from '@/components/wechat/WechatSidebar.vue'
    import type { ChatMessage, ConversationPreview } from '@/types/types'

    const activeMenu = ref('chat')
    const activeConversationId = ref(1)

    const conversations = ref<ConversationPreview[]>([
        {
            id: 1,
            name: '产品群',
            lastMessage: '这周把原型评审安排在周五下午。',
            lastTime: '09:30',
            unread: 3,
            avatar: '产',
        },
        {
            id: 2,
            name: '小李',
            lastMessage: '接口联调完成，等你确认。',
            lastTime: '昨天',
            unread: 0,
            avatar: '李',
        },
        {
            id: 3,
            name: '前端组',
            lastMessage: '下个版本加上消息撤回和已读状态。',
            lastTime: '周一',
            unread: 1,
            avatar: '前',
        },
    ])

    const messagesByConversation = ref<Record<number, ChatMessage[]>>({
        1: [
            { id: 1, sender: 'other', text: '今天确认下新消息页结构。', time: '09:21' },
            { id: 2, sender: 'me', text: '好，我先把会话列表和聊天窗口搭起来。', time: '09:24' },
        ],
        2: [
            { id: 1, sender: 'other', text: '联调地址发你了。', time: '昨天 18:06' },
            { id: 2, sender: 'me', text: '收到，我晚点对一下。', time: '昨天 18:10' },
        ],
        3: [{ id: 1, sender: 'other', text: '先补页面结构，之后接 socket。', time: '周一 14:11' }],
    })

    const activeConversation = computed(() => {
        return conversations.value.find((item) => item.id === activeConversationId.value) ?? conversations.value[0]
    })

    const activeMessages = computed(() => {
        if (!activeConversation.value) {
            return []
        }
        return messagesByConversation.value[activeConversation.value.id] ?? []
    })

    function selectConversation(id: number) {
        activeConversationId.value = id
        conversations.value = conversations.value.map((item) => {
            if (item.id !== id) {
                return item
            }
            return { ...item, unread: 0 }
        })
    }

    function sendMessage(text: string) {
        if (!activeConversation.value) {
            return
        }

        const id = activeConversation.value.id
        const now = new Date()
        const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

        const currentMessages = messagesByConversation.value[id] ?? []
        const nextMessage: ChatMessage = {
            id: currentMessages.length + 1,
            sender: 'me',
            text,
            time,
        }

        messagesByConversation.value[id] = [...currentMessages, nextMessage]

        conversations.value = conversations.value.map((item) => {
            if (item.id !== id) {
                return item
            }
            return {
                ...item,
                lastMessage: text,
                lastTime: time,
            }
        })
    }
</script>

<template>
    <main class="wechat-page">
        <WechatSidebar :active-menu="activeMenu" @change="activeMenu = $event" />

        <template v-if="activeMenu === 'contacts'">
            <WechatContactsPanel />
        </template>

        <template v-else>
            <WechatConversationList :conversations="conversations" :active-conversation-id="activeConversationId"
                @select="selectConversation" />

            <WechatChatWindow :title="activeConversation?.name ?? '会话'"
                :subtitle="activeMenu === 'chat' ? '在线' : '功能演示模式'" :messages="activeMessages" @send="sendMessage" />
        </template>
    </main>
</template>

<style scoped>
    .wechat-page {
        min-height: 100vh;
        display: flex;
        background: radial-gradient(circle at 20% 0%, #f4fbf5 0%, #edf5ef 32%, #e8f0ea 100%);
    }

    @media (max-width: 900px) {
        .wechat-page {
            display: block;
        }
    }
</style>
