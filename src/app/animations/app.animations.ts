import { trigger, state, style, animate, transition } from '@angular/animations';

export function opacity(duration) {
    return trigger('opacity', [
        state('shown', style({
            opacity: 1
        })),
        state('hidden', style({
            opacity: 0
        })),
        transition('* => *', animate(duration + 'ms ease-in-out'))
    ]);
}

