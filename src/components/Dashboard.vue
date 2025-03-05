<template>
    <v-app>
        <v-app-bar :elevation="2">
            <template v-slot:prepend>
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>Student Management System</v-app-bar-title>

            <template v-slot:append>
                <v-btn icon="mdi-heart"></v-btn>
                <v-btn icon="mdi-dots-vertical"></v-btn>
            </template>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" permanent>
            <v-list>
                <template v-for="item in items" :key="item.value">
                    <!-- Check if item has children -->
                    <v-list-group v-if="item.children" :value="item.title">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props">
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </template>
                        <v-list-item v-for="child in item.children" :key="child.value" :to="child.link">
                            <v-list-item-title>{{ child.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>

                    <!-- Render normal items -->
                    <v-list-item v-else :to="item.link">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </template>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, watch } from 'vue';

const drawer = ref(false);
const group = ref(null);

const items = [
    { title: 'Dashboard', value: 'home', link: '/home' },
    { title: 'Courses', value: 'courses', link: '/courses' },
    { title: 'Assignments', value: 'assignments', link: '/assignments' },
    // { title: 'Grade', value: 'grade', link: '/grade' },
    { title: 'Attendance', value: 'attendance', link: '/attendence' },
    {
        title: 'Setting',
        value: 'setting',
        children: [
            { title: 'Student', value: 'student', link: '/studentlist' },
            { title: 'Teacher', value: 'teacher', link: '/teacherlist' },
            { title: 'Department', value: 'department', link: '/departmentlist' },
            { title: 'Submission', value: 'submission', link: '/submissionlist' },
            { title: 'Enrollment Date', value: 'enrollment_date', link: '/enrollmentlist' }
        ]
    }
];

watch(group, () => {
    drawer.value = false;
});
</script>
