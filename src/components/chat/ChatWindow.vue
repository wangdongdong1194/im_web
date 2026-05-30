<script setup lang="ts">
    import { computed, ref } from 'vue'
    import type { ChatMessage } from '../../types/types'

    const props = defineProps<{
        title: string
        subtitle: string
        messages: ChatMessage[]
    }>()

    const emit = defineEmits<{
        send: [text: string]
    }>()

    const draft = ref('')

    const hasMessages = computed(() => props.messages.length > 0)

    function submitMessage() {
        const text = draft.value.trim()
        if (!text) {
            return
        }
        emit('send', text)
        draft.value = ''
    }
</script>

<template>
    <section class="chat-window">
        <header>
            <h2>{{ props.title }}</h2>
            <p>{{ props.subtitle }}</p>
        </header>

        <div class="message-list">
            <div v-if="!hasMessages" class="empty">还没有消息，开始聊天吧</div>

            <article v-for="item in props.messages" :key="item.id" class="message-item" :class="item.sender">
                <p>{{ item.text }}</p>
                <span>{{ item.time }}</span>
            </article>
        </div>

        <footer>
            <textarea v-model="draft" placeholder="输入消息，回车发送" @keydown.enter.prevent="submitMessage" />
        </footer>
    </section>
</template>

<style scoped>
    .chat-window {
        flex: 1;
        background: #f4f8f5;
        display: flex;
        flex-direction: column;
        min-width: 400px;
    }

    header {
        padding: 14px 18px;
        border-bottom: 1px solid #e4ebe6;
        background: #fff;
    }

    h2 {
        margin: 0;
        font-size: 18px;
    }

    header p {
        margin: 4px 0 0;
        color: #73808f;
        font-size: 13px;
    }

    .message-list {
        flex: 1;
        overflow: auto;
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .empty {
        margin: auto;
        color: #8a97a5;
    }

    .message-item {
        max-width: min(560px, 80%);
        display: grid;
        gap: 4px;
    }

    .message-item p {
        margin: 0;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fff;
        line-height: 1.4;
        width: fit-content;
    }

    .message-item span {
        font-size: 12px;
        color: #8190a0;
    }

    .message-item.me {
        margin-left: auto;
        text-align: right;
    }

    .message-item.me p {
        background: #d8f3c4;
    }

    footer {
        border-top: 1px solid #deeadf;
        padding: 12px;
        background: #fff;
        display: grid;
    }

    textarea {
        min-height: 78px;
        resize: none;
        border: 1px solid #ced8d1;
        border-radius: 8px;
        padding: 10px;
        font-size: 14px;
    }

    button {
        border: 0;
        border-radius: 8px;
        background: #2ea043;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
    }

    @media (max-width: 900px) {
        /* .chat-window {
            display: none;
        } */
    }
</style>
