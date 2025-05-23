import { title } from "process";
import { ROUTE } from "./routes";
import { HomeIcon, CalendarIcon, UserIcon, TableCellsIcon, ComputerDesktopIcon, PencilSquareIcon, UsersIcon } from "@heroicons/react/24/outline";
import { link } from "fs";

export const PAGES = {
    STUDENT: [
        // {
        //     title: 'Главная',
        //     link: ROUTE.DASHBOARD,
        //     icon: HomeIcon
        // },
        {
            title: 'Расписание',
            link: ROUTE.SCHEDULE,
            icon: CalendarIcon
        },
        {
            title: 'Профиль',
            link: ROUTE.PROFILE,
            icon: UserIcon
        }
    ],

    TEACHER: [
        
        // {
        //     title: 'Главная',
        //     link: ROUTE.TEACHER_PANEL,
        //     icon: HomeIcon
        // },
        {
            title: 'Расписание',
            link: ROUTE.TEACHER_SCHEDULE,
            icon: CalendarIcon
        },
        {
            title: 'Журнал',
            link: ROUTE.GRADEBOOK,
            icon: PencilSquareIcon
        },
        {
            title: 'Студенты',
            link: ROUTE.TEACHER_STUDENTS,
            icon: UsersIcon
        }
    ],

    ADMIN: [
        // {
        //     title: 'Админ-панель',
        //     link: ROUTE.ADMIN_PANEL,
        //     icon: HomeIcon
        // },
        {
            title: 'Расписание',
            link: ROUTE.ADMIN_SCHEDULE,
            icon: CalendarIcon
        },
        {
            title: 'Управление',
            link: ROUTE.ADMIN_CONTROL,
            icon: ComputerDesktopIcon
        },
        {
            title: 'Занятия',
            link: ROUTE.ADMIN_LESSONS,
            icon: TableCellsIcon
        }
    ]
}
