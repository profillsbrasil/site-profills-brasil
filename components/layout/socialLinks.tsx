import type { ComponentType, SVGProps } from 'react';

export type SocialIconProps = SVGProps<SVGSVGElement>;

export type SocialLink = {
  href: string;
  label: string;
  Icon: ComponentType<SocialIconProps>;
};

export function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.7 1.6-1.7H16V4.9c-.4-.1-1.3-.2-2.2-.2-2.3 0-3.9 1.4-3.9 4.1V11H7.5v3h2.4v7h3.6Z' />
    </svg>
  );
}

export function InstagramIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
      {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.25 2.5h9.5a4.75 4.75 0 0 1 4.75 4.75v9.5a4.75 4.75 0 0 1-4.75 4.75h-9.5a4.75 4.75 0 0 1-4.75-4.75v-9.5A4.75 4.75 0 0 1 7.25 2.5ZM5 7.25C5 6.007 6.007 5 7.25 5h9.5C17.993 5 19 6.007 19 7.25v9.5c0 1.243-1.007 2.25-2.25 2.25h-9.5A2.25 2.25 0 0 1 5 16.75v-9.5ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-1.75 4a1.75 1.75 0 1 0 3.5 0 1.75 1.75 0 0 0-3.5 0Zm6.25-4.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z'
      />
    </svg>
  );
}

export function LinkedInIcon(props: SocialIconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M6.12 8.28a1.78 1.78 0 1 0 0-3.56 1.78 1.78 0 0 0 0 3.56ZM4.6 9.77h3.04V19H4.6V9.77ZM9.44 9.77h2.92V11h.04c.41-.74 1.41-1.52 2.9-1.52 3.11 0 3.7 1.93 3.7 4.86V19h-3.04v-4.1c0-.98-.02-2.24-1.38-2.24-1.37 0-1.58 1.05-1.58 2.17V19H9.44V9.77Z' />
    </svg>
  );
}

export function YouTubeIcon(props: SocialIconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
      {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.07 7.23a3.02 3.02 0 0 0-2.13-2.14C17.05 4.57 12 4.57 12 4.57s-5.05 0-6.94.52a3.02 3.02 0 0 0-2.13 2.14A31.9 31.9 0 0 0 2.5 12c0 1.62.14 3.21.43 4.77a3.02 3.02 0 0 0 2.13 2.14c1.89.52 6.94.52 6.94.52s5.05 0 6.94-.52a3.02 3.02 0 0 0 2.13-2.14A31.9 31.9 0 0 0 21.5 12c0-1.62-.14-3.21-.43-4.77ZM10.25 15.15V8.85L15.5 12l-5.25 3.15Z'
      />
    </svg>
  );
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com/profillsbrasil/',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.instagram.com/profillsdobrasil/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.linkedin.com/company/profillsdobrasil/',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
  },
  {
    href: 'https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw',
    label: 'YouTube',
    Icon: YouTubeIcon,
  },
];
