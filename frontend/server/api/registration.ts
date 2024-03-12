export default defineEventHandler(async (event) => {
    const body = await readBody(event)    
    const query = await $fetch('https://drvcash.com/backendapi/users/register', {
        method: 'post',
        body: {
            email: body.email,
            password: body.password
        }
    })

    return query

})
