<template>
    <v-sheet class="mx-auto" width="300">
        <v-form ref="form" class="mt-8">
            <div class="mt-3">
                <v-row class="mr-2 ml-2">
                <v-col cols="12" class="d-flex flex-column">
                    <v-text-field clearable label="Name" variant="outlined"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mr-2 ml-2">
                    <v-col cols="12"  class="d-flex flex-column">
                        <v-text-field  clearable label="Email" variant="outlined"></v-text-field>
                    </v-col>
                </v-row>
                <div class="d-flex flex-column mr-2 ml-2">
                <v-btn class="mt-4" color="success" block @click="validate">
                    Validate
                </v-btn>

                <v-btn class="mt-4" color="error" block @click="reset">
                    Reset Form
                </v-btn>

                <v-btn class="mt-4 mb-2" color="warning" block @click="resetValidation">
                    Reset Validation
                </v-btn>
            </div>
            </div>         
        </v-form>
    </v-sheet>
</template>
<script setup>
import { ref } from 'vue';

const name = '';







</script>
