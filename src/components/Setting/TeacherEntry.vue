<template>
    <SnackBarDialog ref="snackbarRef" />
    <v-container>
        <v-row>
            <v-col cols="12">
                <router-link :to="{ path: '/teacherlist' }">
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
                            <h2 class="d-flex justify-center">Teacher Information entry</h2>
                        </v-col>
                    </v-row>
                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.name" clearable label="Name" :rules="[v => !!v || 'Name is required']" required variant="outlined"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row class="mr-2 ml-2 mt-2">
                        <v-col cols="12">
                            <v-text-field v-model="model.email" clearable label="Email" :rules="[v => !!v || 'Email is required']" required
                                variant="outlined"></v-text-field>
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
import { onMounted, ref } from 'vue';
import Model from '@/models/Setting/teacher.model';
import TeacherService from '@/services/Teacher.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const model = ref(new Model());
const color = ref("");
const text = ref("");
const snackbarRef = ref(null)



onMounted(() => {
    const tescherId = route.query.id;
    if (tescherId) {
        console.log("Fetching course details for ID:", tescherId);
        GetTeacherDetails(tescherId);
    }
})


const GetTeacherDetails = async (id) => {
    try {
        const res = await TeacherService.GetById(id);
        console.log("Fetched course details:", res.data);
        model.value = res.data;
    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};



// Save or update function
function SaveOrUpdate() {

    TeacherService.SaveOrUpdate(model.value)
        .then((res) => {
            console.log("reach saveorupdate", res.data);
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
