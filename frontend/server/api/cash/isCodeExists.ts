export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {

        const query = await $fetch('https://drvcash.com/api/cash/isCodeExists', {
            method: 'get',
            params: {
                cashCode: body.cashCode 
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
