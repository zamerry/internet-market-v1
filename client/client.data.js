const search_data = document.getElementById('search_data')
const search_data_btn = document.getElementById('search_data_button')
const main_table = document.querySelector('.main__table')

// search_data_btn.addEventListener('click', async () => {
//     const product = search_data.value
//
//     const res = await fetch('http://localhost:5000/shop/search', {
//         method: "POST",
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({product})
//     })
//
//     if (!res.ok) {
//         console.log("ошибка")
//         return
//     }
//
//     const data = await res.json()
//
//     console.log(data)
//
//     main_table.innerHTML = ''
//
//     if (Array.isArray(data.result)) {
//         main_table.innerHTML = data.result.map(p => `
//         <div class="main__table_cards">${p.product_name}</div>
//         `).join('')
//     } else {
//         main_table.innerHTML = `<p>ничего не найдено либо неверная структура</p>`
//     }
//
// })

async function fetchAndRender(p = '') {

    main_table.innerHTML = `<div>Загрузка товаров</div>`

    const product = search_data.value

    const res = await fetch('http://localhost:5000/shop/search', {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({product})
    })

    if (!res.ok) {
        console.log("ошибка")
        return
    }

    const data = await res.json()

    console.log(data)

    main_table.innerHTML = ''

    if (Array.isArray(data.result)) {
        main_table.innerHTML = data.result.map(p => `
        <div class="main__table_cards">${p.product_name}</div>
        `).join('')
    } else {
        main_table.innerHTML = `<p>ничего не найдено либо неверная структура</p>`
    }

}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRender()
})

search_data_btn.addEventListener('click', () => {
    const input_value = search_data.value
    fetchAndRender(input_value)
})