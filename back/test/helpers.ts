import app from '../src/app';

export async function buildParams(userId: string, password: string) {
    if (!userId)
        throw new Error('No userId was provided');
    const user = await app.service('users').get(userId);
    const {accessToken} = await app.service('authentication').create({phone: user.phone, strategy: 'local', password}, {});
    // TODO: figure out how to avoid populating user and trigger authentication hook
    return {
        accessToken,
        headers: {Authorization: accessToken},
        provider: 'socket.io',
        user,
        authenticated: true,
        query: {}
    };
}
