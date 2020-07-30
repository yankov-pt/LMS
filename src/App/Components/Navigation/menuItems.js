
export default [
    { path: "/home", name: "Начало", withAuth: false },
    { path: "/books", name: "Всички книги", withAuth: false },
    {
        path: "/category", name: "Категории", withAuth: false,
        innerMenu: [
            { path: "/category/Българска и световна литература", name: "Българска и световна литература", withAuth: false },
            { path: "/category/Българска филология и начална педагогика", name: "Българска филология и начална педагогика", withAuth: false },
            { path: "/category/Биографии и други", name: "Биографии и други", withAuth: false },
            { path: "/category/Съвременна литература", name: "Съвременна литература", withAuth: false },
            { path: "/category/Право и политологи", name: "Право и политологи", withAuth: false },
            { path: "/category/Икономика и бизнес", name: "Икономика и бизнес", withAuth: false },
            { path: "/category/География и история", name: "География и история", withAuth: false },
            { path: "/category/Енциклопедии", name: "Енциклопедии", withAuth: false },
            { path: "/category/Речници", name: "Речници", withAuth: false },
            { path: "/category/IT и програмиране", name: "IT и програмиране", withAuth: false },
            { path: "/category/Физика и математика", name: "Физика и математика", withAuth: false },
            { path: "/category/Анатомия и биология", name: "Анатомия и биология", withAuth: false }
        ]
    },
]