import {bus} from '~/constants';

export interface ToastOptions {
    message: string
    timeout?: number
    type?: string
    closable?: boolean
}

export function useToast(id: string) {
    return {
        show(opts: ToastOptions) {
            bus.emit('toast.open', {id, ...opts});
        },
        hide() {
            bus.emit('toast.close', {id});
        }
    };
}
