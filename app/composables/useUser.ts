import {ServiceResponse} from '~/composables/useService';
import {User} from '~/types/user';
import {parseJwt} from '~/utils/login';

export function useUser(id?: string): ServiceResponse<User> {
    if (!id) {
        const token = useToken();
        const payload = parseJwt(token);
        return useService<User>('users', {auth: true}).get(payload.sub);
    }
    return useService<User>('users').get(id);
}
