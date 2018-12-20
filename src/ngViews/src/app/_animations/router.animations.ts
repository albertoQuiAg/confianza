import { trigger, style, animate, transition, keyframes } from '@angular/animations';

export const componentAnimation = trigger('componentAnimation', [
    transition(':enter', [
        animate('600ms ease-in', keyframes([
            style({ opacity: 0, transform: 'scale(0.99)' }),
            style({ opacity: 0.5, transform: 'scale(1)' }),
            style({ opacity: 1, transform: 'scale(1)' })
        ]))
    ])
]);


export const formAnimation = trigger('formAnimation', [
    transition(':enter', [
        style({ height: "!", transform: 'translateX(100%)' }),
        animate('0.5s cubic-bezier(.35, 0, .25, 1)', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
        style({ height: "!", transform: "translateX(0%)" }),
        animate('0.5s cubic-bezier(.35, 0, .25, 1)', style({ transform: 'translateX(100%)' }))
    ])
]);
