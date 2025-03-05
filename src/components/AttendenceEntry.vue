<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/attendence' }">
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
                            <h2 class="d-flex justify-center"> Attendence Information entry</h2>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-autocomplete v-model="model.student_id" :rules="[v => !!v || 'Name is required']" required clearable label="Student Name" variant="outlined"
                                :items="studentlist" item-title="name" item-value="id"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-autocomplete v-model="model.course_id" :rules="[v => !!v || 'Name is required']" required clearable label="Course Name" variant="outlined"
                                :items="courselist" item-title="title" item-value="id"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.attendence_date" :rules="[v => !!v || 'Date is required']" required label="Attendence Date" variant="outlined"
                                prepend-inner-icon="mdi-calendar" readonly @click="dialog = true"></v-text-field>
                            <v-dialog v-model="dialog" width="350px">
                                <v-card>
                                    <v-date-picker v-model="date" @update:modelValue="updateDate"></v-date-picker>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.status" clearable label=" Status" :rules="[v => !!v || 'Status is required']" required
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <div class="mr-2 ml-2 mt-2">
                        <v-row>
                            <v-col cols="12"  class="d-flex justify-end">
                                <v-btn class="mr-3" color="error" @click="resetForm">Cancel</v-btn>
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
import Model from '@/models/Setting/attendence.model';
import attendenceService from '@/services/attendence.service';
import dropdownService from '@/services/dropdown.service';
import SnackBarDialog from './Navigation/SnackBarDialog.vue';
import { useRoute } from 'vue-router';



const route = useRoute();
const snackbarRef = ref(null)
const model = ref(new Model());
const color = ref("");
const text = ref("");
const courselist = ref([]);
const studentlist = ref([]);
const date = ref(null);
const dialog = ref(false);






onMounted(() => {
    GetCourseList();
    GetStudentList();
    const attendenceId = route.query.id;
    if (attendenceId) {
        console.log("Fetching course details for ID:", attendenceId);
        GetAttendenceDetails(attendenceId);
    }
})


const GetAttendenceDetails = async (id) => {
    try {
        const res = await attendenceService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};

const updateDate = (value) => {
    const date = new Date(value);
    model.value.attendence_date = date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    dialog.value = false;
};

const GetCourseList = () => {
    dropdownService.GetCourseList().then((res) => {
        console.log("courselist", res.data)
        courselist.value = res.data;
    })
}
const GetStudentList = () => {
    dropdownService.GetStudentList().then((res) => {
        console.log("student list", res.data)
        studentlist.value = res.data;
    })
}

// Save or update function
function SaveOrUpdate() {
    attendenceService.SaveOrUpdate(model.value)
        .then((res) => {
            if (res.data.success) {
                color.value = "success";
            } else {
                color.value = "red darken-2";
            }
            text.value = res.data.messages[0];
            snackbarRef.value?.OpenSnackbar(color.value, text.value);
        })
        .catch((error) => {
            console.error("Error saving student data:", error);
            color.value = "red darken-2";
            text.value = "An error occurred while saving the student data.";
            snackbarRef.value?.OpenSnackbar(color.value, error.message || "Unknown error");
        });
}

function resetForm() {
    model.value = new Model();  // Reset form data
}

</script>
