export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {

        console.log(body)

        const query = await $fetch('https://drvcash.com/backendapi/cash/checkCash', {
            method: 'get',
            params: {
                cashName: body.cashName 
            },
            headers: {
                authorization: body.authentication,
            }
        })

        return query

    } catch (error) {

        return error

    }

})
