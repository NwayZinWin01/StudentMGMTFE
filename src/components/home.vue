<template>
    <v-sheet class="mx-auto" width="300">

        <v-form ref="form" class="mt-3">
            <!-- <v-text-field class="mt-3" v-model="name" :counter="10" :rules="nameRules" label="Name" required variant="outlined"></v-text-field> -->
           
                        <v-text-field v-model="name" clearable label="Name" :rules="nameRules" required variant="outlined"></v-text-field>
                
            <v-select class="mt-3" v-model="select" :items="items" :rules="[v => !!v || 'Name is required']" label="Item"
                required></v-select>

            <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree to continue!']" label="Do you agree?"
                required></v-checkbox>
             
            <div class="d-flex flex-column">
                <v-btn class="mt-4" color="success" block @click="validate">
                    Validate
                </v-btn>

                <v-btn class="mt-4" color="error" block @click="reset">
                    Reset Form
                </v-btn>

                <v-btn class="mt-4" color="warning" block @click="resetValidation">
                    Reset Validation
                </v-btn>
            </div>
        </v-form>
    </v-sheet>
</template>
<script>
export default {
    data: () => ({
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be 10 characters or less',
        ],
        select: null,
        items: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4',
        ],
        checkbox: false,
    }),

    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) alert('Form is valid')
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
    },
}
</script>