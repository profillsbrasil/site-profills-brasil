import type { ComponentType, SVGProps } from 'react';

export type SocialIconProps = SVGProps<SVGSVGElement>;

export type SocialLink = {
  href: string;
  label: string;
  Icon: ComponentType<SocialIconProps>;
};

export function WhatsAppIcon(props: SocialIconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.15c-.25.69-1.44 1.32-1.99 1.36-.53.05-.53.42-3.34-.83-2.8-1.25-4.5-4.19-4.63-4.38-.13-.19-1.09-1.55-1.03-2.9.06-1.36.79-2 1.06-2.27.27-.27.58-.33.77-.33h.55c.18 0 .42-.07.65.53.25.65.83 2.24.9 2.4.07.16.11.35.01.55-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.29.76 1.29 1.63 2.09 1.12 1.03 2.06 1.35 2.35 1.5.29.15.46.13.63-.08.17-.2.73-.86.92-1.16.2-.29.39-.24.66-.14.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.12.07.7-.18 1.39Z' />
    </svg>
  );
}

export function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
      <path d='M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.7 1.6-1.7H16V4.9c-.4-.1-1.3-.2-2.2-.2-2.3 0-3.9 1.4-3.9 4.1V11H7.5v3h2.4v7h3.6Z' />
    </svg>
  );
}

export function InstagramIcon(props: SocialIconProps) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
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
    <svg viewBox='0 0 24 24' fill='currentColor' aria-hidden='true' {...props}>
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
    Icon: FacebookIcon
  },
  {
    href: 'https://www.instagram.com/profillsdobrasil/',
    label: 'Instagram',
    Icon: InstagramIcon
  },
  {
    href: 'https://www.linkedin.com/company/profillsdobrasil/',
    label: 'LinkedIn',
    Icon: LinkedInIcon
  },
  {
    href: 'https://www.youtube.com/channel/UCQhaNOzqbkYnZlknSd79zEw',
    label: 'YouTube',
    Icon: YouTubeIcon
  }
];
