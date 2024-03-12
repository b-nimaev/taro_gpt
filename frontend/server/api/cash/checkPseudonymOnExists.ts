export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {

        console.log(body)

        const query = await $fetch('https://drvcash.com/backendapi/cash/checkPseudonym', {
            method: 'get',
            params: {
                cashPseudonym: body.pseudonym 
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
