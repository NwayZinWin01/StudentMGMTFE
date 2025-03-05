<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/studentlist' }">
                    <v-icon size="large">mdi-arrow-left-thin-circle-outline</v-icon>
                    <span> BACK</span>
                </router-link>
            </v-col>
        </v-row>

        <v-sheet class="mx-auto" width="350">
            <v-form ref="form" class="mt-2">
                <div class="mt-3">
                    <v-row>
                        <v-col>
                            <h2 class="d-flex justify-center">Student Information entry</h2>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.name" :rules="[v => !!v || 'Name is required']" required
                                clearable label="Name" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.email" clearable label="Email"
                                :rules="[v => !!v || 'Email is required']" required variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.phone_no" clearable label="Phone NO"
                                :rules="[v => !!v || 'Phone Number is required']" required
                                variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-autocomplete v-model="model.dept_id" clearable label="Department Name" :items="deptlist"
                                :rules="[v => !!v || 'Name is required']" required variant="outlined" item-value="id"
                                item-title="name"></v-autocomplete>
                        </v-col>
                    </v-row>

                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.enrollment_date" label="Enrollment Date" variant="outlined"
                                :rules="[v => !!v || 'Date is required']" required prepend-inner-icon="mdi-calendar"
                                readonly @click="dialog = true"></v-text-field>
                            <v-dialog v-model="dialog" width="350px">
                                <v-card>
                                    <v-date-picker v-model="date" @update:modelValue="updateDate"></v-date-picker>
                                </v-card>
                            </v-dialog>
                        </v-col>
                    </v-row>
                    <div>

                        <v-row>
                            <v-col cols="12" class="d-flex justify-center mr-5">
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
import { onMounted, ref } from 'vue';
import Model from '@/models/Setting/Students.model';
import StudentsService from '@/services/Students.service';
import dropdownService from '@/services/dropdown.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import { useRoute } from 'vue-router';


const route = useRoute();
const snackbarRef = ref(null)
const model = ref(new Model());
const color = ref("");
const text = ref("");
const date = ref(null);
const dialog = ref(false);
const deptlist = ref([]);


const updateDate = (value) => {
    const date = new Date(value);
    model.value.enrollment_date = date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    dialog.value = false;
};


const GetDeptList = () => {
    dropdownService.GetDeptList().then((res) => {
        console.log("get detplist in entry", res.data)
        deptlist.value = res.data;
    })
}


onMounted(() => {
    GetDeptList();
    const stuId = route.query.id;
    if (stuId) {
        console.log("Fetching course details for ID:", stuId);
        GetStudentDetails(stuId);
    }
})


const GetStudentDetails = async (id) => {
    try {
        const res = await StudentsService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};




// Save or update function
function SaveOrUpdate() {
    console.log("Model data being sent:", JSON.stringify(model.value, null, 2));
    StudentsService.SaveOrUpdate(model.value)
        .then((res) => {
            if (res.data.success) {
                color.value = "success";
            } else {
                color.value = "red darken-2";
            }
            text.value = res.data.messages[0];
            model.value = res.data.data;
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
