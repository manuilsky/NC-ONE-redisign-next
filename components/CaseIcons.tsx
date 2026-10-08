type IconProps = {
  className?: string;
};

export function IconBack({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 2.25 4 6l3.5 3.75"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrow({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrowUpRight({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.2 6.2 4.7 8.7 9.8 3.5"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.6665 2.66663H11.3332V5.99996C11.3332 6.88401 10.982 7.73186 10.3569 8.35698C9.73174 8.9821 8.88389 9.33329 7.99984 9.33329C7.11578 9.33329 6.26794 8.9821 5.64281 8.35698C5.01769 7.73186 4.6665 6.88401 4.6665 5.99996V2.66663Z"
        stroke="currentColor"
        strokeWidth="1.06667"
      />
      <path
        d="M4.66679 3.33337H2.66679C2.35737 3.51019 2.13086 3.80267 2.0371 4.14649C1.94333 4.4903 1.98998 4.85729 2.16679 5.16671C2.3436 5.47613 2.63609 5.70264 2.97991 5.7964C3.32372 5.89017 3.69071 5.84352 4.00013 5.66671M11.3335 3.33337H13.3335C13.6429 3.51019 13.8694 3.80267 13.9632 4.14649C14.0569 4.4903 14.0103 4.85729 13.8335 5.16671C13.6566 5.47613 13.3642 5.70264 13.0203 5.7964C12.6765 5.89017 12.3095 5.84352 12.0001 5.66671"
        stroke="currentColor"
        strokeWidth="1.06667"
      />
      <path
        d="M8 9.33337V11.3334M6 13.3334H10"
        stroke="currentColor"
        strokeWidth="1.06667"
      />
    </svg>
  );
}

export function IconPlatform({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.625 3H10.875C11.4963 3 12 3.50368 12 4.125V9.375C12 9.99632 11.4963 10.5 10.875 10.5H2.625C2.00368 10.5 1.5 9.99632 1.5 9.375V4.125C1.5 3.50368 2.00368 3 2.625 3Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M5.25 13.5H6.75M6.75 13.5H8.25M6.75 13.5V10.5"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M13.5 6H15.75C16.1642 6 16.5 6.33579 16.5 6.75V12C16.5 12.4142 16.1642 12.75 15.75 12.75H13.5C13.0858 12.75 12.75 12.4142 12.75 12V6.75C12.75 6.33579 13.0858 6 13.5 6Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IconTeam({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6C9 7.24264 7.99264 8.25 6.75 8.25C5.50736 8.25 4.5 7.24264 4.5 6C4.5 4.75736 5.50736 3.75 6.75 3.75C7.99264 3.75 9 4.75736 9 6Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M2.25 15C2.25 12.525 4.275 10.5 6.75 10.5C9.225 10.5 11.25 12.525 11.25 15"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M14.85 6.75039C14.85 7.70308 14.0777 8.47539 13.125 8.47539C12.1723 8.47539 11.4 7.70308 11.4 6.75039C11.4 5.7977 12.1723 5.02539 13.125 5.02539C14.0777 5.02539 14.85 5.7977 14.85 6.75039Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M11.625 15C11.85 13.05 13.275 11.55 15.15 11.25"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IconType({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.15 2.25H7.35C7.84706 2.25 8.25 2.65294 8.25 3.15V7.35C8.25 7.84706 7.84706 8.25 7.35 8.25H3.15C2.65294 8.25 2.25 7.84706 2.25 7.35V3.15C2.25 2.65294 2.65294 2.25 3.15 2.25Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M10.65 2.25H14.85C15.3471 2.25 15.75 2.65294 15.75 3.15V7.35C15.75 7.84706 15.3471 8.25 14.85 8.25H10.65C10.1529 8.25 9.75 7.84706 9.75 7.35V3.15C9.75 2.65294 10.1529 2.25 10.65 2.25Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M3.15 9.75H7.35C7.84706 9.75 8.25 10.1529 8.25 10.65V14.85C8.25 15.3471 7.84706 15.75 7.35 15.75H3.15C2.65294 15.75 2.25 15.3471 2.25 14.85V10.65C2.25 10.1529 2.65294 9.75 3.15 9.75Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M10.65 9.75H14.85C15.3471 9.75 15.75 10.1529 15.75 10.65V14.85C15.75 15.3471 15.3471 15.75 14.85 15.75H10.65C10.1529 15.75 9.75 15.3471 9.75 14.85V10.65C9.75 10.1529 10.1529 9.75 10.65 9.75Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IconDuration({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
      <path
        d="M9 5.25V9L11.625 10.5"
        stroke="#EDEDF2"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function IconClient({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 17.5V5.5L9.5 2.5L16 5.5V17.5"
        stroke="#EDEDF2"
        strokeWidth="1.33333"
        strokeLinejoin="miter"
        strokeMiterlimit={8}
      />
      <path
        d="M7 17.5V12.5H12V17.5"
        stroke="#EDEDF2"
        strokeWidth="1.33333"
        strokeLinejoin="miter"
        strokeMiterlimit={8}
      />
    </svg>
  );
}

export function IconTask({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        stroke="#EDEDF2"
        strokeWidth="1.33333"
      />
      <circle
        cx="10"
        cy="10"
        r="3.75"
        stroke="#EDEDF2"
        strokeWidth="1.33333"
      />
      <circle cx="10" cy="10" r="1.16667" fill="#EDEDF2" />
    </svg>
  );
}
