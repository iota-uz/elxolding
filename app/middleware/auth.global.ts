export default defineNuxtRouteMiddleware(async (to) => {
    if (!to.meta.authRoute)
        return;

    if (!useLoggedIn()) {
        return navigateTo('/login');
    }

    const user = useState('user');
    const promise = useUser().exec().then(r => user.value = r);
    if (!user.value) {
        await promise;
    }
});
