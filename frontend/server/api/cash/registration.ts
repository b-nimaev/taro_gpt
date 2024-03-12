export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    try {

        const query = await $fetch('https://drvcash.com/api/cash/register', {
            method: 'post',
            body: {
                name: body.name,
                pseudonym: body.pseudonym,
                code: body.code,
                phones: body.phones,
                author: body.author
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
