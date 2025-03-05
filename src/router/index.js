/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'


// import Home from '@/components/Dashboard.vue'
import Assignments from '@/components/Assignments.vue'
import Courses from '@/components/Courses.vue'
import Grade from '@/components/Grade.vue'
import Attendence from '@/components/Attendence.vue'
import StudentList from '@/components/Setting/StudentList.vue'
import StudentEntry from '@/components/Setting/StudentEntry.vue'
import Teacherentry from '@/components/Setting/TeacherEntry.vue'
import TeacherList from '@/components/Setting/TeacherList.vue'
import DepartmentEntry from '@/components/Setting/DepartmentEntry.vue'
import DepartmentList from '@/components/Setting/DepartmentList.vue'
import CoursesEntry from '@/components/CourseEntry.vue'
import AssignmentEntry from '@/components/AssignmentEntry.vue'
import AttendenceEntry from '@/components/AttendenceEntry.vue'
import SubmissionList from '@/components/Setting/SubmissionList.vue'
import EnrollmentList from '@/components/Setting/EnrollmentList.vue'
import EnrollmentEntry from '@/components/Setting/EnrollmentEntry.vue'
import SubmissionEntry from '@/components/Setting/SubmissionEntry.vue'
import Home from '@/components/home.vue'
import Test from '@/components/test.vue'


const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component:Test
  // },
  
  {
    path: '/assignments',
    name: 'assignments',
    component: Assignments,
    children: [
      {
        path: 'assignmententry',
        name: 'assignmententry',
        component: AssignmentEntry
      }
    ]
  },
  {
    path: '/courses',
    name: 'courses',
    component: Courses,
    children: [
      {
        path: 'coursesentry',
        name: 'coursesentry',
        component: CoursesEntry
      }
    ]
  },
  {
    path: '/grade',
    name: 'grade',
    component: Grade
  },
  {
    path: '/attendence',
    name: 'attendence',
    component: Attendence,
    children: [
      {
        path: 'attendenceentry',
        name: 'attendenceentry',
        component: AttendenceEntry
      }
    ]
  },
  {
    path: '/studentlist',
    name: 'studentlist',
    component: StudentList,
    children: [
      {
        path: 'studententry',
        name: 'studententry',
        component: StudentEntry
      },
    ]
  },
  {
    path: '/teacherlist',
    name: 'teacherlist',
    component: TeacherList,
    children: [
      {
        path: 'teacherentry',
        name: 'teacherentry',
        component: Teacherentry
      },
    ]
  },
  {
    path: '/departmentlist',
    name: 'departmentlist',
    component: DepartmentList,
    children: [
      {
        path: 'departmententry',
        name: 'departmententry',
        component: DepartmentEntry
      },
    ]
  },
  {
    path: '/submissionlist',
    name: 'submissionlist',
    component: SubmissionList,
    children: [
      {
        path: 'submissionentry',
        name: 'submissionentry',
        component: SubmissionEntry
      },
    ]
  },
  {
    path: '/enrollmentlist',
    name: 'enrollmentlist',
    component: EnrollmentList,
    children: [
      {
        path: 'enrollmententry',
        name: 'enrollmententry',
        component: EnrollmentEntry
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
