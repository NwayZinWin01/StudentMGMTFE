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
                                        <v-text-field v-model="model.title" clearable label="Title" 
                                            variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-autocomplete v-model="model.course_id"  clearable label="Course Name" variant="outlined"
                                :items="courselist" item-title="title" item-value="id"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="model.due_date" label="Due Date" variant="outlined" 
                                prepend-inner-icon="mdi-calendar" readonly @click="dialog = true"></v-text-field>
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
                    <router-link to="/assignments/assignmententry">
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
                                    <router-link :to="{ name: 'assignmententry', query: { id: item.id } }">
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
  import Model from '@/models/Setting/assignment.model';
import assignmentService from '@/services/assignment.service';
import ConfirmDialog from './Navigation/ConfirmDialog.vue';
import SnackBarDialog from './Navigation/SnackBarDialog.vue';
import dropdownService from '@/services/dropdown.service';


const confirmRef = ref(null)
var selected_id = ref(0)
  const model = ref(new Model());
  const route = useRoute();
  const isExactActive = ref(false);
  const loading = ref(false);
  const data = ref([]);
  const snackbarRef = ref(null)
  const courselist = ref([]);
const date = ref(null);
const dialog = ref(false);

  
  const headers = [
  { title: " Action", align: "center", key: "action", sortable: false },
    { title: " Title", align: "center", key: "title" },
    { title: " Course Name", align: "center", key: "course_name" },
    { title: "Description", align: "center", key: "description" },
    { title: "Due Date", align: "center", key: "due_date" },
    
  ];
  
  onMounted(() => {
    GetCourseList();
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
  
    assignmentService.GetAll()
        .then((res) => {
            console.log("assignment",res.data)
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
        assignmentService.Delete(selected_id.value).then((res) => {           
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
 
 
const GetCourseList = () => {
    dropdownService.GetCourseList().then((res) => {
        courselist.value = res.data;
    })
}


const updateDate = (value) => {
    const date = new Date(value);
    model.value.due_date = date.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
    dialog.value = false;
}; 


const filter = () => {
    let filteredData = [...data.value]; // Start with all teachers

    if (model.value.title) {
        filteredData = filteredData.filter(item => 
            item.title === model.value.title
        );
    }
    if (model.value.course_id) {
        filteredData = filteredData.filter(item => 
            item.course_id === model.value.course_id
        );
    }

    if (model.value.due_date) {
    const selectedDate = new Date(model.value.due_date).toISOString().split("T")[0];
    filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.due_date).toISOString().split("T")[0];
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



  </script>
  