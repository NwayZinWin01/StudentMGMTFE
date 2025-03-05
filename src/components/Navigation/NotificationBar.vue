<template>
    <v-navigation-drawer v-model="store.rightDrawer" width="350" location="right" app clipped class="custom-drawer">
      <v-sheet style="height: 100%; overflow-y: auto;">
        <v-expansion-panels v-model="expandedPanel" elevation="2">
          <!-- Loop through categories (Inbox, Outbox, etc.) -->
          <v-expansion-panel v-for="(category, index) in groupedNotifications" :key="index">
            <v-expansion-panel-title>
              <v-row align="center" no-gutters>
                <v-col>
                  <span class="font-weight-bold text-primary">{{ category.name }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge v-if="category.cases?.length > 0" :content="category.cases.length" color="red" overlap
                    class="notification-badge">
                    <span></span>
                  </v-badge>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
  
            <!-- Nested Expansion Panel for Subcategories (e.g. ဦး/ရေး ထောက်) -->
            <v-expansion-panel-text>
              <v-expansion-panels v-model="category.expandedPanel" elevation="2">
                <v-expansion-panel v-for="(subCategory, subIndex) in category.subCategories" :key="subIndex">
                  <v-expansion-panel-title>
                    {{ subCategory.name }}
                  </v-expansion-panel-title>
                  
                  <!-- Case Details Panel -->
                  <v-expansion-panel-text>
                    <v-list dense>
                      <v-list-item v-for="(item, idx) in subCategory.cases" :key="idx" @click="showCaseDetails(item)">
                        <v-hover v-slot="{ hover }" close-delay="286" open-delay="64">
                          <v-card :elevation="hover ? 24 : 5" :class="{ 'on-hover': hover }" class="outlined pa-0 mb-1">
                            <v-card-text
                              :class="store.case_no_noti == item.caseNo || store.case_no_notiAC == item.caseNo || store.case_no_notiIC == item.caseNo ? 'text-primary' : 'text-black'">
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <p class="text-caption">
                                    <strong>Case No:</strong> {{ item.caseNo }}
                                  </p>
                                </v-col>
                              </v-row>
                              <v-row class="mt-n3">
                                <v-col cols="12" sm="12">
                                  <p class="text-caption">
                                    <strong>Due Date:</strong> {{ item.expireDate }}
                                  </p>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-sheet>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useAppStore } from "@/stores/app";
  
  // Reactive variables
  const store = useAppStore();
  const expandedPanel = ref([]); // To manage expanded panels at the outer level
  const groupedNotifications = ref([
    {
      name: "ဝင်စာ",
      subCategories: [
        {
          name: "ဦး/ရေး ထောက်",
          cases: [
            { caseNo: "UC-202401", expireDate: "2025-02-10", description: "Urgent case requiring immediate attention" },
            { caseNo: "UC-202402", expireDate: "2025-02-12", description: "Pending review for urgent case" },
          ],
        },
        {
          name: "စစ်ဆေးထင်မြင်ချက်",
          cases: [
            { caseNo: "PA-202403", expireDate: "2025-02-15", description: "Awaiting manager's approval" },
            { caseNo: "PA-202404", expireDate: "2025-02-20", description: "Pending additional documents" },
          ],
        },
        {
          name: "စုံစမ်းထောက်လှမ်း",
          cases: [
            { caseNo: "CC-202405", expireDate: "2025-01-30", description: "Case successfully closed" },
            { caseNo: "CC-202406", expireDate: "2025-01-28", description: "Final report submitted" },
          ],
        },
      ],
    },
    {
      name: "တင်ပြစာ",
      subCategories: [
      {
          name: "ဦး/ရေး ထောက်",
          cases: [
            { caseNo: "UC-202401", expireDate: "2025-02-10", description: "Urgent case requiring immediate attention" },
            { caseNo: "UC-202402", expireDate: "2025-02-12", description: "Pending review for urgent case" },
          ],
        },
        {
          name: "စစ်ဆေးထင်မြင်ချက်",
          cases: [
            { caseNo: "PA-202403", expireDate: "2025-02-15", description: "Awaiting manager's approval" },
            { caseNo: "PA-202404", expireDate: "2025-02-20", description: "Pending additional documents" },
          ],
        },
        {
          name: "စုံစမ်းထောက်လှမ်း",
          cases: [
            { caseNo: "CC-202405", expireDate: "2025-01-30", description: "Case successfully closed" },
            { caseNo: "CC-202406", expireDate: "2025-01-28", description: "Final report submitted" },
          ],
        },
      ],
    },
  ]);
  
  // Show case details when a case is clicked
  const showCaseDetails = (item) => {
    store.caseNo_noti = item.caseNo; // Update the store with the clicked case number
    // Additional logic to navigate or show the details of the case can be added here
  };
  
  onMounted(() => {
    console.log("Right Drawer value is", store.rightDrawer);
  });
  </script>
  
  <style scoped>
  .custom-drawer {
    background: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .v-expansion-panel-title {
    padding: 10px;
    background: #f9f9f9;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .v-expansion-panel-text {
    padding: 1px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .text-primary {
    color: #3f51b5;
  }
  
  .notification-badge {
    position: absolute;
    top: 21px;
    left: 288px;
    font-size: 10px;
    padding: 0 4px;
  }
  </style>
  