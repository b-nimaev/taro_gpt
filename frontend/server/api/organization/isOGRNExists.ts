export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {

        const query = await $fetch('https://drvcash.com/api/organization/isOGRNExsits', {
            method: 'get',
            params: {
                ogrn: body.ogrn
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
