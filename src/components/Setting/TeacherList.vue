<template>
    <ConfirmDialog ref="confirmRef" @confirm="DeleteItem" />
    <SnackBarDialog ref="snackbarRef"/>
    <div>
        <v-container v-show="isExactActive">
            <v-row>
                <v-col cols="12">
                    <v-expansion-panels>
                        <v-expansion-panel>
                            <v-expansion-panel-title>ရှာဖွေရန်</v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row>
                                    <v-col cols="12" md="3">
                                        <v-text-field clearable label="Name" variant="outlined"
                                            v-model="model.name"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field clearable label="Email" variant="outlined"
                                            v-model="model.email"></v-text-field>
                                    </v-col>
                                </v-row>
                                
                                <v-row class="d-flex justify-end">
                                    <v-col cols="12" md="3" >
                                        <v-btn class="mr-2" @click="filter" variant="flat" color="primary">Filter</v-btn>
                                        <v-btn dark variant="flat" color="warning" @click.stop="ClearData()">Cancel</v-btn>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" md="2">
                    <router-link to="/teacherlist/teacherentry">
                        <v-btn prepend-icon="mdi-plus"> ADD </v-btn>
                    </router-link>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="12">
                    <v-data-table @update:options="GetAll" :loading="loading" :headers="headers" :items="data">
                        <template v-slot:item.action="{ item }">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <router-link :to="{ name: 'teacherentry', query: { id: item.id } }">
                                        <v-icon v-bind="props" class="ml-2" color="orange">mdi-pencil</v-icon>
                                    </router-link>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" class="ml-2" color="red" @click="Delete(item.id)">
                                        mdi-delete
                                    </v-icon>
                                </template>
                                <span>Delete</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>

        </v-container>
        <!-- This is required to render child routes -->
        <router-view />
    </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from "vue-router";
import Model from '@/models/Setting/teacher.model';
import TeacherService from '@/services/Teacher.service';
import ConfirmDialog from '../Navigation/ConfirmDialog.vue';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';

const confirmRef = ref(null)
var selected_id = ref(0)
const model = ref(new Model());
const route = useRoute();
const isExactActive = ref(false);
const loading = ref(false);
const data = ref([]);
const snackbarRef = ref(null)

const headers = [
{ title: " Action", align: "center", key: "action", sortable: false },
    { title: "Teacher Name", align: "center", key: "name" },
    { title: "Email", align: "center", key: "email" },
   
];

onMounted(() => {
    isExactActive.value = route.matched.length === 1;
});

// Watch for route changes
watch(
    () => route.matched.length,
    (val) => {
        isExactActive.value = val === 1;
        GetAll()
    }
);

const GetAll = () => {
    loading.value = true;

    TeacherService.GetAll()
        .then((res) => {
            data.value = res.data;
        })
        .catch((err) => console.error("Error fetching students:", err))
        .finally(() => (loading.value = false));
};


const Delete = (id) => {
    selected_id.value = id
    confirmRef.value.OpenDialog('Delete Alert', 'Are you sure to delete this item?')
}
const DeleteItem = (val) => {
    if (val) {
        TeacherService.Delete(selected_id.value).then((res) => {           
            if (!res.data.success) {
                snackbarRef.value.OpenSnackbar('red darken-2', res.data.messages[0])
            }
        }).catch((err) => {
           
                snackbarRef.value.OpenSnackbar('red darken-2', err.message)
          
        }).finally(() => {
            GetAll()
        })
    } else {
        selected_id.value = 0
    }
}
const filter = () => {
    let filteredData = [...data.value]; // Start with all teachers

    if (model.value.name?.trim()) {
        filteredData = filteredData.filter(item =>
            item.name?.toLowerCase().includes(model.value.name.toLowerCase())
        );
    }

    if (model.value.email?.trim()) {
        filteredData = filteredData.filter(item =>
            item.email?.toLowerCase().includes(model.value.email.toLowerCase())
        );
    }

    // Update the displayed data
    data.value = filteredData;

    // If no filters are applied, fetch all data again
    if (!model.value.name && !model.value.email) {
        GetAll();
    }
};


const ClearData =() =>{
model.value=new Model();
GetAll();
 }
</script>
