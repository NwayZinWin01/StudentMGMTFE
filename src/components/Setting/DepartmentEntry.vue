<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/departmentlist' }">
                    <v-icon size="large">mdi-arrow-left-thin-circle-outline</v-icon>
                    BACK
                </router-link>
            </v-col>
        </v-row>
        <v-sheet class="mx-auto" width="300">
            <v-form ref="form" @submit.prevent="SaveOrUpdate" v-model="isValid" >
                <div class="mt-3">
                    <h2 class="d-flex justify-center mt-5">Department Information</h2>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.name" :rules="nameRules" required clearable label="Name" variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>
                    <div>
                        <v-row>
                            <v-col cols="12" class="d-flex justify-center mr-5">
                                <v-btn class="mr-3" color="error" @click="resetForm">Cancel</v-btn>
                                <v-btn color="success" :loading="loading" Type="submit">SAVE</v-btn>
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
import Model from '@/models/Setting/department.model';
import DepartmentService from '@/services/Department.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const model = ref(new Model());
const color = ref("");
const text = ref("");
const snackbarRef = ref(null)
var isValid = ref(false)
var loading = ref(false)

const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 10) || 'Name must be 10 characters or less',
];


onMounted(() => {
    const deptid = route.query.id;
    if (deptid) {
        console.log("Fetching course details for ID:", deptid);
        GetDeptDetails(deptid);
    }
})


const GetDeptDetails = async (id) => {
    try {
        const res = await DepartmentService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};




// Save or update function
function SaveOrUpdate() {
    if (isValid.value) {
        loading.value = true
    DepartmentService.SaveOrUpdate(model.value)
        .then((res) => {
            if (res.data.success) {
                color.value = "success";
            } else {
                color.value = "red darken-2";
            }
            text.value = res.data.messages[0];
            Object.assign(model.value, res.data.data);
            snackbarRef.value?.OpenSnackbar(color.value, text.value);
        })
        .catch((error) => {
            console.error("Error saving student data:", error);
            color.value = "red darken-2";
            text.value = "An error occurred while saving the student data.";
            snackbarRef.value?.OpenSnackbar(color.value, error.message || "Unknown error");
        }).finally(() => {
            loading.value = false
        })
    }
}
function resetForm() {
    model.value = new Model();  // Reset form data
}

</script>
