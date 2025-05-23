import { Grade } from "@/interface";

export const getGradeValue = (grade: Grade | undefined) => {
    if (grade) {
        if (grade.attend && grade.grade != 0 || grade.grade) {
            return grade.grade
        } else if (!grade.attend && grade.grade == 0 || !grade.attend) {
            return 'Н'
        } else if (grade.attend && grade.grade == 0) {
            return '-'
        }
    } else {
        return '-'
    }
}