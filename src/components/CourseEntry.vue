<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/courses' }">
                    <v-icon size="large">mdi-arrow-left-thin-circle-outline</v-icon>
                 BACK
                </router-link>
            </v-col>
        </v-row>
        <v-sheet class="mx-auto" width="350">
            <v-form ref="form" class="mt-2">
                <div class="mt-3">
                    <v-row>
                        <v-col>
                            <h2 class="d-flex justify-center">Course Information entry</h2>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.title" clearable label="Title" :rules="[v => !!v || 'Title is required']" required
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.course_code" clearable label="Course Code" :rules="[v => !!v || 'Course Code is required']" required
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12"> 
                            <v-autocomplete v-model="model.dept_id" clearable label="Department Name" :items="deptlist" :rules="[v => !!v || 'Name is required']" required
                                variant="outlined" item-value="id" item-title="name"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-autocomplete v-model="model.teacher_id" clearable label="Teacher Name" variant="outlined" :rules="[v => !!v || 'Name is required']" required
                                :items="teacherlist" item-value="id" item-title="name"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <div class="mr-2 ml-2 mt-2">
                        <v-row>
                            <v-col cols="12" class="d-flex justify-end">
                                <v-btn color="error" class="mr-3" @click="resetForm">Cancel</v-btn>
                                <v-btn color="success" @click="SaveOrUpdate">SAVE</v-btn>
                            </v-col>
                        </v-row>
                    </div>

                </div>
            </v-form>
        </v-sheet>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Model from '@/models/Setting/course.model';
import CourseService from '@/services/Courses.service';
import dropdownService from '@/services/dropdown.service';
import SnackBarDialog from './Navigation/SnackBarDialog.vue';

const route = useRoute();
const model = ref(new Model());
const deptlist = ref([]);
const teacherlist = ref([]);
const color = ref("");
const text = ref("");
const snackbarRef = ref(null)


onMounted(() => {
    GetDeptList();
    GetTeacherList();
    const courseId = route.query.id;
    if (courseId) {
        console.log("Fetching course details for ID:", courseId);
        GetCourseDetails(courseId);
    }
});

const GetCourseDetails = async (id) => {
    try {
        const res = await CourseService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};

const GetDeptList = () => {
    dropdownService.GetDeptList().then((res) => {
        deptlist.value = res.data;
    });
};

const GetTeacherList = () => {
    dropdownService.GetTeacherlist().then((res) => {
        console.log("teacherlist", res.data);
        teacherlist.value = res.data;
    });
};

function SaveOrUpdate() {
    console.log("Saving data...", model.value);
    CourseService.SaveOrUpdate(model.value)
        .then((res) => {
            if (res.data.success) {
                color.value = "success";
                text.value = "Course successfully saved!";
            } else {
                color.value = "red darken-2";
                text.value = res.data.messages[0] || "Something went wrong!";
            }
            snackbarRef.value?.OpenSnackbar(color.value, text.value);
        })
        .catch((error) => {
            console.error("Error saving course data:", error);
            color.value = "red darken-2";
            text.value = "An error occurred while saving the course data.";
            snackbarRef.value?.OpenSnackbar(color.value, error.message || "Unknown error");
        });
}

function resetForm() {
    model.value = new Model();
}

</script>
