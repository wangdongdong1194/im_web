<script setup lang="ts">
    import { computed, ref } from 'vue'

    interface ContactItem {
        id: number
        name: string
        avatar: string
        note: string
        status: string
    }

    const contacts = ref<ContactItem[]>([
        { id: 1, name: '小李', avatar: '李', note: '前端工程师', status: '在线' },
        { id: 2, name: '产品群', avatar: '产', note: '42 位成员', status: '群聊' },
        { id: 3, name: '王经理', avatar: '王', note: '项目负责人', status: '离线' },
        { id: 4, name: '设计组', avatar: '设', note: '12 位成员', status: '群聊' },
    ])

    const activeContactId = ref(1)

    const activeContact = computed(() => {
        return contacts.value.find((item) => item.id === activeContactId.value) ?? contacts.value[0]
    })
</script>

<template>
    <div class="contacts-panel">
        <section class="contact-list">
            <header>
                <h3>通讯录</h3>
            </header>
            <ul>
                <li v-for="item in contacts" :key="item.id" :class="{ active: item.id === activeContactId }"
                    @click="activeContactId = item.id">
                    <div class="avatar">{{ item.avatar }}</div>
                    <div>
                        <strong>{{ item.name }}</strong>
                        <p>{{ item.note }}</p>
                    </div>
                </li>
            </ul>
        </section>

        <section class="contact-detail">
            <div class="profile-card">
                <div class="big-avatar">{{ activeContact?.avatar }}</div>
                <h2>{{ activeContact?.name }}</h2>
                <p>{{ activeContact?.note }}</p>
                <span>{{ activeContact?.status }}</span>
            </div>
        </section>
    </div>
</template>

<style scoped>
    .contacts-panel{
        display: flex;
        width: 100%;
    }
    .contact-list {
        width: 300px;
        border-right: 1px solid #e9edf2;
        background: #f7f9fb;
        display: flex;
        flex-direction: column;
    }

    header {
        padding: 16px;
        border-bottom: 1px solid #e9edf2;
    }

    h3 {
        margin: 0;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    li {
        display: grid;
        grid-template-columns: 44px 1fr;
        gap: 10px;
        padding: 12px 14px;
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

    strong {
        display: block;
        margin-bottom: 5px;
    }

    p {
        margin: 0;
        color: #667684;
        font-size: 13px;
    }

    .contact-detail {
        flex: 1;
        display: grid;
        place-items: center;
        background: #f4f8f5;
    }

    .profile-card {
        width: min(420px, 88%);
        background: #fff;
        border: 1px solid #dfe8e0;
        border-radius: 16px;
        padding: 28px;
        text-align: center;
    }

    .big-avatar {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        margin: 0 auto 14px;
        display: grid;
        place-items: center;
        font-size: 28px;
        font-weight: 700;
        color: #2f5940;
        background: #d6e5d8;
    }

    h2 {
        margin: 0;
    }

    .profile-card p {
        margin: 8px 0;
    }

    span {
        display: inline-block;
        margin-top: 4px;
        border-radius: 999px;
        padding: 4px 12px;
        background: #ebf7ec;
        color: #2e6a3f;
        font-size: 12px;
    }

    @media (max-width: 900px) {
        .contact-list {
            width: 100%;
            border-right: 0;
        }

        .contact-detail {
            display: none;
        }
    }
</style>