import type { SVGProps } from 'react';

export function DagobaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L12 5"/>
      <path d="M10 5L14 5"/>
      <path d="M12 5C17.5228 5 22 7.23858 22 10C22 12.7614 17.5228 15 12 15C6.47715 15 2 12.7614 2 10C2 7.23858 6.47715 5 12 5Z"/>
      <path d="M4 15H20"/>
      <path d="M6 18H18"/>
      <path d="M8 21H16"/>
    </svg>
  );
}
