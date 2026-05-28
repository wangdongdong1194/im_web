<script setup lang="ts">
    import { computed, onBeforeUnmount, ref } from 'vue'
    import { io, Socket } from 'socket.io-client'

    type LogLevel = 'info' | 'ok' | 'error'

    interface LogItem {
        id: number
        level: LogLevel
        text: string
        time: string
    }

    function getDefaultServerUrl() {
        const currentPort = window.location.port
        if (currentPort === '5173') {
            return 'http://127.0.0.1:3003'
        }
        if (currentPort === '5174') {
            return 'http://127.0.0.1:3004'
        }
        return 'http://127.0.0.1:3003'
    }

    const serverUrl = ref(getDefaultServerUrl())
    const socketPath = ref('/socket.io')

    const userId = ref('1001')
    const toUserId = ref('1002')
    const privateMessage = ref('hello from 1001')

    const conversationId = ref<number>(1)
    const groupMessage = ref('hello group')

    const messagePayload = ref('ping')

    const connected = ref(false)
    const socketId = ref('')
    const logs = ref<LogItem[]>([])

    let logId = 0
    let socket: Socket | null = null

    const connectLabel = computed(() => (connected.value ? 'Disconnect' : 'Connect'))

    function pushLog(level: LogLevel, text: string) {
        logs.value.unshift({
            id: ++logId,
            level,
            text,
            time: new Date().toLocaleTimeString(),
        })
    }

    function bindSocketEvents(currentSocket: Socket) {
        currentSocket.on('connect', () => {
            connected.value = true
            socketId.value = currentSocket.id ?? ''
            pushLog('ok', `connected: ${socketId.value}`)
        })

        currentSocket.on('disconnect', (reason) => {
            connected.value = false
            socketId.value = ''
            pushLog('info', `disconnect: ${reason}`)
        })

        currentSocket.on('connect_error', (err) => {
            pushLog('error', `connect_error: ${err.message}`)
        })

        currentSocket.on('bind_user_ok', (data) => {
            pushLog('ok', `bind_user_ok: ${JSON.stringify(data)}`)
        })

        currentSocket.on('bind_user_error', (err) => {
            pushLog('error', `bind_user_error: ${JSON.stringify(err)}`)
        })

        currentSocket.on('send_to_user_ok', (data) => {
            pushLog('ok', `send_to_user_ok: ${JSON.stringify(data)}`)
        })

        currentSocket.on('send_to_user_error', (err) => {
            pushLog('error', `send_to_user_error: ${JSON.stringify(err)}`)
        })

        currentSocket.on('send_to_group_ok', (data) => {
            pushLog('ok', `send_to_group_ok: ${JSON.stringify(data)}`)
        })

        currentSocket.on('send_to_group_error', (err) => {
            pushLog('error', `send_to_group_error: ${JSON.stringify(err)}`)
        })

        currentSocket.on('private_message', (data) => {
            pushLog('info', `private_message: ${JSON.stringify(data)}`)
        })

        currentSocket.on('group_message', (data) => {
            pushLog('info', `group_message: ${JSON.stringify(data)}`)
        })

        currentSocket.on('reply', (msg) => {
            pushLog('info', `reply: ${JSON.stringify(msg)}`)
        })
    }

    function connectSocket() {
        if (socket?.connected) {
            socket.disconnect()
            return
        }

        if (socket) {
            socket.removeAllListeners()
        }

        socket = io(serverUrl.value, {
            path: socketPath.value,
        })

        bindSocketEvents(socket)
    }

    function emitBindUser() {
        if (!socket?.connected) {
            pushLog('error', 'socket not connected')
            return
        }
        socket.emit('bind_user', { userId: userId.value })
        pushLog('info', `emit bind_user: ${JSON.stringify({ userId: userId.value })}`)
    }

    function emitSendToUser() {
        if (!socket?.connected) {
            pushLog('error', 'socket not connected')
            return
        }
        const payload = { toUserId: toUserId.value, message: privateMessage.value }
        socket.emit('send_to_user', payload)
        pushLog('info', `emit send_to_user: ${JSON.stringify(payload)}`)
    }

    function emitSendToGroup() {
        if (!socket?.connected) {
            pushLog('error', 'socket not connected')
            return
        }
        const payload = { conversationId: conversationId.value, message: groupMessage.value }
        socket.emit('send_to_group', payload)
        pushLog('info', `emit send_to_group: ${JSON.stringify(payload)}`)
    }

    function emitMessage() {
        if (!socket?.connected) {
            pushLog('error', 'socket not connected')
            return
        }
        socket.emit('message', messagePayload.value)
        pushLog('info', `emit message: ${JSON.stringify(messagePayload.value)}`)
    }

    function clearLogs() {
        logs.value = []
    }

    onBeforeUnmount(() => {
        if (socket) {
            socket.removeAllListeners()
            socket.disconnect()
        }
    })
</script>

<template>
    <main class="page">
        <h1>Socket.IO Demo</h1>
        <p class="subtitle">用于本地 IM 服务快速连通与事件调试</p>

        <section class="card">
            <h2>连接设置</h2>
            <div class="grid">
                <label>
                    服务地址
                    <input v-model="serverUrl" type="text" />
                </label>
                <label>
                    Socket Path
                    <input v-model="socketPath" type="text" />
                </label>
            </div>
            <div class="row">
                <button @click="connectSocket">{{ connectLabel }}</button>
                <span :class="['status', connected ? 'on' : 'off']">
                    {{ connected ? `Connected (${socketId})` : 'Disconnected' }}
                </span>
            </div>
        </section>

        <section class="card">
            <h2>事件发送</h2>

            <div class="line">
                <label>
                    userId
                    <input v-model="userId" type="text" />
                </label>
                <button @click="emitBindUser">bind_user</button>
            </div>

            <div class="line">
                <label>
                    toUserId
                    <input v-model="toUserId" type="text" />
                </label>
                <label>
                    message
                    <input v-model="privateMessage" type="text" />
                </label>
                <button @click="emitSendToUser">send_to_user</button>
            </div>

            <div class="line">
                <label>
                    conversationId
                    <input v-model.number="conversationId" type="number" min="1" />
                </label>
                <label>
                    message
                    <input v-model="groupMessage" type="text" />
                </label>
                <button @click="emitSendToGroup">send_to_group</button>
            </div>

            <div class="line">
                <label>
                    payload
                    <input v-model="messagePayload" type="text" />
                </label>
                <button @click="emitMessage">message</button>
            </div>
        </section>

        <section class="card">
            <div class="row header-row">
                <h2>日志</h2>
                <button class="ghost" @click="clearLogs">清空</button>
            </div>
            <ul class="logs">
                <li v-for="item in logs" :key="item.id" :class="item.level">
                    <span class="time">{{ item.time }}</span>
                    <span>{{ item.text }}</span>
                </li>
            </ul>
        </section>
    </main>
</template>

<style scoped>
    .page {
        max-width: 980px;
        margin: 24px auto;
        padding: 0 16px 24px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }

    h1 {
        margin: 0;
    }

    .subtitle {
        color: #566;
        margin: 8px 0 18px;
    }

    .card {
        border: 1px solid #d5dce1;
        border-radius: 10px;
        padding: 14px;
        margin-top: 14px;
        background: #fff;
    }

    h2 {
        font-size: 16px;
        margin: 0 0 10px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 10px;
    }

    .line {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
        align-items: end;
        margin-bottom: 10px;
    }

    label {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        color: #495057;
        gap: 6px;
    }

    input {
        height: 34px;
        border: 1px solid #b8c2cc;
        border-radius: 8px;
        padding: 0 10px;
        font-size: 14px;
    }

    button {
        height: 34px;
        border: none;
        border-radius: 8px;
        background: #1f6feb;
        color: #fff;
        padding: 0 14px;
        cursor: pointer;
    }

    button.ghost {
        background: #f1f3f5;
        color: #334;
    }

    .row {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-top: 10px;
    }

    .header-row {
        justify-content: space-between;
        margin-top: 0;
    }

    .status {
        font-size: 13px;
        font-weight: 600;
    }

    .status.on {
        color: #0b7a3e;
    }

    .status.off {
        color: #a12727;
    }

    .logs {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 340px;
        overflow: auto;
        border: 1px solid #e1e4e8;
        border-radius: 8px;
    }

    .logs li {
        display: grid;
        grid-template-columns: 84px 1fr;
        gap: 8px;
        padding: 8px 10px;
        font-size: 13px;
        border-bottom: 1px solid #f0f1f2;
    }

    .logs li:last-child {
        border-bottom: none;
    }

    .logs li.ok {
        background: #f3fff7;
    }

    .logs li.error {
        background: #fff4f4;
    }

    .time {
        color: #61707d;
    }
</style>