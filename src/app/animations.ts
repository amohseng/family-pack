import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

export const fadeInAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter', [
        style({ opacity: '0'})
      ], { optional: true }),
      group([
        query(':enter', [
          animate('3000ms ease-out', style({ opacity: '1'}))
        ], { optional: true })
      ]),
      query(':enter', animateChild(), { optional: true }),
    ])
  ]);
