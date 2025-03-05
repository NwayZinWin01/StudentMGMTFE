<template>
     <SnackBarDialog ref="snackbarRef"/>
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/submissionlist' }">
                    <v-icon size="large">mdi-arrow-left-thin-circle-outline</v-icon>
                    Submission Information
                </router-link>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field v-model="model.stu_id" :rules="[v => !!v || 'Name is required']" required clearable label="Student Name" variant="outlined"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field v-model="model.assignment_id" :rules="[v => !!v || 'Name is required']" required clearable label="Assignment Name" variant="outlined"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field v-model="model.submission_date" :rules="[v => !!v || 'Submission is required']" required clearable label="Submission Date" variant="outlined"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field v-model="model.grade" :rules="[v => !!v || 'Grade is required']" required clearable label=" Grade" variant="outlined"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2" class="d-flex justify-end">
                <v-btn class="mr-3" @click="resetForm">Cancel</v-btn>
                <v-btn @click="SaveOrUpdate">SAVE</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import Model from '@/models/Setting/submission.model';
import submissionService from '@/services/submission.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';

const model = ref(new Model());
const color = ref("");
const text = ref("");
const snackbarRef = ref(null)

// Save or update function
function SaveOrUpdate() {
    console.log("reach saveorupdate", model.value);
    submissionService.SaveOrUpdate(model.value)
        .then((res) => {
            if (res.data.success) {
                color.value = "success";
            } else {
                color.value = "red darken-2";
            }
            text.value = res.data.messages[0];
        })
        .catch((error) => {
            console.error("Error saving student data:", error);
            color.value = "red darken-2";
            text.value = "An error occurred while saving the student data.";
        });
}

function resetForm() {
    model.value = new Model();  // Reset form data
}

</script>
