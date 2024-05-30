import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

import { ANIMATION_SPEED } from './constants';

const detailInAnimation = [
  //style the host: animates the containers in place, without the DOM moving things around.
  style({ background: 'transparent', position: 'relative' }),
  query(
    ':enter, :leave',
    [
      style({
        background: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '100%',
      }),
    ],
    { optional: true }
  ),
  // start state for the view that is entering (off screen)
  query(':enter', style({ position: 'fixed', transform: 'translateX(100%)' }), { optional: true }),
  // animate the incoming view (slide in from right)
  query(':enter', [animate(`${ANIMATION_SPEED} ease-in-out`, style({ transform: 'translateX(0%)' }))], { optional: true }),
];

const detailOutAnimation = [
  style({ background: 'transparent', position: 'relative' }),
  query(
    ':enter, :leave',
    [
      style({
        background: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '100%',
      }),
    ],
    { optional: true }
  ),
  // start state for the view that is entering (off screen)
  query(':leave', style({ position: 'fixed', transform: 'translateX(0%)', 'z-index': '100' }), { optional: true }),
  // animate the incoming view (slide in from right)
  query(':leave', [animate(`${ANIMATION_SPEED} ease-in-out`, style({ transform: 'translateX(100%)' }))], { optional: true }),
];

const detailUpAnimation = [
  //style the host: animates the containers in place, without the DOM moving things around.
  style({ background: 'transparent', position: 'relative' }),
  query(
    ':enter, :leave',
    [
      style({
        background: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '100%',
      }),
    ],
    { optional: true }
  ),
  // start state for the view that is entering (off screen)
  query(':leave', style({ display: 'none' }), { optional: true }),
  query(':enter', style({ position: 'fixed', transform: 'translateY(100%)' }), { optional: true }),
  query(':enter', [animate(`${ANIMATION_SPEED} ease-in-out`, style({ transform: 'translateY(0%)' }))], { optional: true }),
];

const detailDownAnimation = [
  style({ background: 'transparent', position: 'relative' }),
  query(
    ':enter, :leave',
    [
      style({
        background: 'transparent',
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '100%',
      }),
    ],
    { optional: true }
  ),
  // start state for the view that is entering (off screen)
  query(':enter', style({ display: 'none' }), { optional: true }),
  query(':leave', style({ position: 'fixed', transform: 'translateY(0%)' }), { optional: true }),
  query(':leave', [animate(`${ANIMATION_SPEED} ease-in-out`, style({ transform: 'translateY(100%)' }))], { optional: true }),
];

export const slideInAnimation = trigger('routeAnimations', [
  // run this animation when route changes from page (desktop) to details (desktop)
  transition('* => pricing-details', detailInAnimation),
  transition('pricing-details => *', detailOutAnimation),
  transition('* => build-details', detailInAnimation),
  transition('build-details => *', detailOutAnimation),
  transition('* => admin', detailInAnimation),
  transition('admin=>*', detailOutAnimation),
  transition('* => job-details', detailInAnimation),
  transition('job-details =>*', detailOutAnimation),
  ///////Mobile
  transition('* => mobile-pricing-details', detailUpAnimation),
  transition('mobile-pricing-details => *', detailDownAnimation),
  transition('* => mobile-build-details', detailUpAnimation),
  transition('mobile-build-details => *', detailDownAnimation),
  transition('* => mobile-admin', detailUpAnimation),
  transition('mobile-admin => *', detailDownAnimation),
  transition('* => mobile-job-details', detailUpAnimation),
  transition('mobile-job-details =>*', detailDownAnimation),
]);
