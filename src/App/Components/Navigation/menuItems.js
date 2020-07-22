
export default [
    { path: "/home", name: "Начало", withAuth: false },
    { path: "/books", name: "Всички книги", withAuth: false },
    {
        path: "/category", name: "Категории", withAuth: false,
        innerMenu: [
            { path: "/category/За деца", name: "За деца", withAuth: false },
            { path: "/category/Биографии", name: "Биографии", withAuth: false },
            { path: "/category/Криминални", name: "Криминални", withAuth: false },
            { path: "/category/Бизнес и икономика", name: "Бизнес и икономика", withAuth: false },
            { path: "/category/Еротика", name: "Еротика", withAuth: false },
            { path: "/category/Документални", name: "Документални", withAuth: false },
            { path: "/category/Фантастика", name: "Фантастика", withAuth: false },
            { path: "/category/История", name: "История", withAuth: false },
            { path: "/category/Класика", name: "Класика", withAuth: false },
            { path: "/category/Поезия", name: "Поезия", withAuth: false },
            { path: "/category/Разкази", name: "Разкази", withAuth: false },
            { path: "/category/Самоусъвършенстване", name: "Самоусъвършенстване", withAuth: false },
            { path: "/category/Романи", name: "Романи", withAuth: false },
            { path: "/category/Езици", name: "Езици", withAuth: false },
            { path: "/category/Трилъри и съспенс", name: "Трилъри и съспенс", withAuth: false },
            { path: "/category/Тийн литература", name: "Тийн литература", withAuth: false },
            { path: "/category/Романси", name: "Романси", withAuth: false },
            { path: "/category/Религия", name: "Религия", withAuth: false },
        ]
    },
]