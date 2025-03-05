<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/enrollmentlist' }">
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
                            <h2 class="d-flex justify-center"> Enrollment Information entry</h2>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-autocomplete v-model="model.student_id" :rules="[v => !!v || 'Name is required']" required  clearable label="Student Name" variant="outlined"
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
                            <v-text-field v-model="model.enrollment_date" :rules="[v => !!v || 'Date is required']" required label="Enrollment Date" variant="outlined"
                                prepend-inner-icon="mdi-calendar" readonly @click="dialog = true"></v-text-field>
                            <v-dialog v-model="dialog" width="350px">
                                <v-card>
                                    <v-date-picker v-model="date" @update:modelValue="updateDate"></v-date-picker>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <div class="mr-2 ml-2 mt-2">
                        <v-row>
                            <v-col cols="12"  class="d-flex justify-end">
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
import { ref ,onMounted} from 'vue';
import Model from '@/models/Setting/enrollment.model';
import enrollmentService from '@/services/enrollment.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import dropdownService from '@/services/dropdown.service';
import { useRoute } from 'vue-router';

const model = ref(new Model());
const color = ref("");
const text = ref("");
const snackbarRef = ref(null)
const courselist = ref([]);
const studentlist = ref([]);
const date = ref(null);
const dialog = ref(false);
const route=useRoute();

onMounted(() => {
    GetCourseList();
    GetStudentList();
    const stuId = route.query.id;
    if (stuId) {
        console.log("Fetching course details for ID:", stuId);
        GetEnrollmentDetails(stuId);
    }
})
const GetEnrollmentDetails = async (id) => {
    try {
        const res = await enrollmentService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};

const updateDate = (value) => {
    const date = new Date(value);
    model.value.enrollment_date = date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    dialog.value = false;
};

const GetCourseList = () => {
    dropdownService.GetCourseList().then((res) => {
        courselist.value = res.data;
    })
}
const GetStudentList = () => {
    dropdownService.GetStudentList().then((res) => {
        studentlist.value = res.data;
    })
}

// Save or update function
function SaveOrUpdate() {
    console.log("Model data being sent:", JSON.stringify(model.value, null, 2));
    enrollmentService.SaveOrUpdate(model.value)
        .then((res) => {
            console.log("success save",res.data)
            if (res.data.success) {
                color.value = "success";
            } else {
                color.value = "red darken-2";
            }
            text.value = res.data.messages[0];
            snackbarRef.value?.OpenSnackbar(color.value, text.value);
        })
        .catch((error) => {
            console.error("Error saving enrollment data:", error);
            color.value = "red darken-2";
            text.value = "An error occurred while saving the enrollment data.";
            snackbarRef.value?.OpenSnackbar(color.value, error.message || "Unknown error");
        });
}

function resetForm() {
    model.value = new Model();  // Reset form data
}

</script>
