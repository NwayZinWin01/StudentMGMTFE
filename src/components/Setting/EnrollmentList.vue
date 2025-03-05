<template>
    <ConfirmDialog ref="confirmRef" @confirm="DeleteItem" />
    <SnackBarDialog ref="snackbarRef" />
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
                            <v-autocomplete v-model="model.student_id"   clearable label="Student Name" variant="outlined"
                                :items="studentlist" item-title="name" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-autocomplete v-model="model.course_id"  clearable label="Course Name" variant="outlined"
                                :items="courselist" item-title="title" item-value="id"></v-autocomplete>
                        </v-col>
                                    <v-col cols="12"  md="3">
                            <v-text-field v-model="model.enrollment_date" label="Enrollment Date" variant="outlined"
                                prepend-inner-icon="mdi-calendar"
                                readonly @click="dialog = true"></v-text-field>
                            <v-dialog v-model="dialog" width="350px">
                                <v-card>
                                    <v-date-picker v-model="date" @update:modelValue="updateDate"></v-date-picker>
                                </v-card>
                            </v-dialog>
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
                    <router-link to="/enrollmentlist/enrollmententry">
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
                                    <router-link :to="{ name: 'enrollmententry', query: { id: item.id } }">
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
import Model from '@/models/Setting/enrollment.model';
import enrollmentService from '@/services/enrollment.service';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import ConfirmDialog from '../Navigation/ConfirmDialog.vue';
import dropdownService from '@/services/dropdown.service';


const model = ref(new Model());
const route = useRoute();
const isExactActive = ref(false);
const loading = ref(false);
const data = ref([]);
const enrollment = ref([]);
const confirmRef = ref(null)
var selected_id = ref(0)
const snackbarRef = ref(null)
const date = ref(null);
const dialog = ref(false);
const courselist = ref([]);
const studentlist = ref([]);



const headers = [
    { title: " Action", align: "center", key: "action", sortable: false },
    { title: " Student Name", align: "center", key: "student_name" },
    { title: " Course Name", align: "center", key: "courses_name" },
    { title: "Enrollment Date", align: "center", key: "enrollment_date" },

];

onMounted(() => {
    enrollmentService.GetAll()
        .then((res) => {
            enrollment.value = res.data;
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
        });
        GetCourseList();
        GetStudentList();
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
    enrollmentService.GetAll()
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
        enrollmentService.Delete(selected_id.value).then((res) => {
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

    if (model.value.student_id) {
        filteredData = filteredData.filter(item => 
            item.student_id === model.value.student_id
        );
    }
    if (model.value.course_id) {
        filteredData = filteredData.filter(item => 
            item.course_id === model.value.course_id
        );
    }

    if (model.value.enrollment_date) {
    const selectedDate = new Date(model.value.enrollment_date).toISOString().split("T")[0];
    filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.enrollment_date).toISOString().split("T")[0];
        return itemDate === selectedDate;
    });
}

    // Update the displayed data
    data.value = filteredData;

   
};


const ClearData =() =>{
model.value=new Model();
GetAll();
 }

 
// const updateDate = (value) => {
//     const date = new Date(value);
//     model.value.enrollment_date = date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
//     dialog.value = false;
// };

const updateDate = (value) => {
    const date = new Date(value);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Adjust for timezone shift
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
</script>