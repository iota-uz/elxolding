import type {User} from '~/types/user';
import {parseJwt} from '~/utils/login';

export function useUser(id?: string): Promise<User> {
    if (!id) {
        const token = useToken();
        const payload = parseJwt(token);
        return useService('users', {auth: true}).get<User>(payload.sub).exec();
    }
    return useService('users').get<User>(id).exec();
}
