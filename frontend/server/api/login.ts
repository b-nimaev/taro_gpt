export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    const query = await $fetch('https://drvcash.com/api/users/login', {
        method: 'post',
        body: {
            password: body.password,
            email: body.username
        }
    })

    return query

})
