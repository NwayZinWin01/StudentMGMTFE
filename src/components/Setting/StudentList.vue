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
                                    <v-col cols="12" md="3">
                                        <v-text-field clearable label="Phone Number" variant="outlined"
                                            v-model="model.phone_no"></v-text-field>
                                    </v-col>  </v-row>
                                <v-row >
                        <v-col cols="12"  md="3">
                            <v-autocomplete v-model="model.dept_id" clearable label="Department Name" :items="deptlist"
                                variant="outlined" item-value="id"
                                item-title="name"></v-autocomplete>
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
                    <router-link to="/studentlist/studententry">
                        <v-btn prepend-icon="mdi-plus"> ADD </v-btn>
                    </router-link>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="12">
                    <!-- <v-data-table :items="students" :headers="headers"></v-data-table> -->
                    
                        <v-data-table @update:options="GetAll" :loading="loading"
                            :headers="headers" :items="data">
                            <template v-slot:item.action="{ item }">
                            <v-tooltip location="top">
                                <template v-slot:activator="{ props }">
                                    <router-link :to="{ name: 'studententry', query: { id: item.id } }">
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
import Model from '@/models/Setting/Students.model';
import StudentsService from '@/services/Students.service';
import ConfirmDialog from '../Navigation/ConfirmDialog.vue';
import SnackBarDialog from '../Navigation/SnackBarDialog.vue';
import dropdownService from '@/services/dropdown.service';

const model = ref(new Model());
const route = useRoute();
const isExactActive = ref(false);
const students = ref([]);
const loading = ref(false);
const data = ref([]);
const confirmRef = ref(null)
var selected_id = ref(0)
const snackbarRef = ref(null)
const date = ref(null);
const dialog = ref(false);
const deptlist = ref([]);



const headers = [
{ title: " Action", align: "center", key: "action", sortable: false },
    { title: "Student Name", align: "center", key: "name" },
    { title: "Email", align: "center", key: "email" },
    { title: "Phone No", align: "center", key: "phone_no" },
    { title: "Department Name", align: "center", key: "dept_name" },
    { title: "Enrollment Date", align: "center", key: "enrollment_date" },
];

onMounted(() => {
 
    StudentsService.GetAll()
        .then((res) => {
            students.value = res.data;
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
        });

        GetDeptList();
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
    StudentsService.GetAll()
        .then((res) => {
            console.log("get studentlist",res.data)
            data.value = res.data;
        })
        .catch((err) => console.error("Error fetching students:", err))
        .finally(() => (loading.value = false));
};


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


const GetDeptList = () => {
    dropdownService.GetDeptList().then((res) => {
        console.log("get detplist in entry", res.data)
        deptlist.value = res.data;
    })
}

const Delete = (id) => {
    selected_id.value = id
    confirmRef.value.OpenDialog('Delete Alert', 'Are you sure to delete this item?')
}
const DeleteItem = (val) => {
    if (val) {
        StudentsService.Delete(selected_id.value).then((res) => {           
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
};

const filter = () => {
    let filteredData = students.value; // Start with the original data

    if (model.value.name) {
        filteredData = filteredData.filter(item => 
            item.name?.toLowerCase().includes(model.value.name.toLowerCase())
        );
    }

   else if (model.value.email) {
        filteredData = filteredData.filter(item => 
            item.email?.toLowerCase().includes(model.value.email.toLowerCase())
        );
    }

  else  if (model.value.phone_no) {
        filteredData = filteredData.filter(item => 
            item.phone_no?.toString().includes(model.value.phone_no.toString())
        );
    }

  else  if (model.value.dept_id) {
        filteredData = filteredData.filter(item => 
            item.dept_id === model.value.dept_id
        );
    }
 
 else if (model.value.enrollment_date) {
    const selectedDate = new Date(model.value.enrollment_date).toISOString().split("T")[0];
    filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.enrollment_date).toISOString().split("T")[0];
        return itemDate === selectedDate;
    });
}
    data.value = filteredData; // Update the displayed data
};


const ClearData =() =>{
model.value=new Model();
GetAll();
 }
</script>
