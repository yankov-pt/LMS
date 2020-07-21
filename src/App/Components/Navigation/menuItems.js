
export default [
    { path: "/home", name: "Начало", withAuth: false },
    { path: "/books", name: "Всички книги", withAuth: false },
    {
        path: "/category", name: "Категории", withAuth: false,
        innerMenu: [
            { path: "/category/Детска литература", name: "За деца", withAuth: false },
            { path: "/category/Биографии", name: "Биографии", withAuth: false },
            { path: "/category/Криминални", name: "Криминални", withAuth: false },]
    },
]