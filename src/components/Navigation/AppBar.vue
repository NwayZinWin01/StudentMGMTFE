<template>
    <v-app-bar color="blue" elevation="6">
        <v-app-bar-nav-icon @click="navSlider = !navSlider"></v-app-bar-nav-icon>
        <v-app-bar-title>EDMS</v-app-bar-title>
        <v-btn class="ml-2" icon style="color:white;" @click="toggleNotifications">
            <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn class="ml-2" icon style="color:white;" v-bind="props">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>
            <v-card width="300">
                <v-list density="compact">
                    <v-list-item class="mt-2 text-center">
                        <v-avatar size="45">
                            <v-icon size="45" color="primary" icon="mdi-account-circle"></v-icon>
                        </v-avatar>
                    </v-list-item>
                    <v-list-item class="mt-n3 text-center">{{ store.loginUser.role.name }}</v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="text-center">
                        <p class="mt-1 mb-1">{{ store.loginUser.name }}</p>
                    </v-list-item>

                    <v-list-item class="text-center mt-1">
                        <v-btn block class="mb-2" color="primary" elevated @click="manageAccount(store.loginUser.id)">
                            Manage Account
                        </v-btn>
                    </v-list-item>
                    <v-list-item class="text-center">
                        <v-btn block class="mb-2" color="warning" prepend-icon="mdi-logout" elevated @click="Logout">
                            Logout
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>
    </v-app-bar>
    <NotificationBar v-if="notificationMenu" />
    <Drawer v-model="navSlider" />
</template>

<script setup>
import Drawer from './Drawer.vue';
import { useAppStore } from '@/stores/app'
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import NotificationBar from './NotificationBar.vue'


const router = useRouter();
var store = ref(useAppStore());
var navSlider = ref(true);
var notificationCount = ref(0);
var notifications = ref([]);
const notificationMenu = ref(false);

const manageAccount = () => { }

const Logout = () => {
    localStorage.removeItem("dmsuser")
    store.value.setLoggedOutUser()
    router.push({ name: 'Login' })

}



onMounted(() => {


});

const toggleNotifications = () => {

    notificationMenu.value = !notificationMenu.value;

};
</script>

<style scoped>
.notification-badge {
    position: absolute;
    top: 8px;
    right: 4px;
    font-size: 10px;
    padding: 0 4px;
}

.noticard {
    margin-left: 1142px;
    margin-top: 50px;
}
</style>
