import React from 'react';

export default function MicOffIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24">
      <g fill="none" fillRule="evenodd">
        <path
          fill={props.color || '#707578'}
          d="M11.889 6.667c.276 0 .5.224.5.5 0 3.114-2.396 5.67-5.445 5.923v2.632c0 .276-.223.5-.5.5-.245 0-.45-.177-.491-.41l-.009-.09V13.09c-1.116-.093-2.145-.494-3-1.119l.717-.717c.793.54 1.751.857 2.783.857 2.731 0 4.945-2.214 4.945-4.944 0-.276.224-.5.5-.5zM1 6.667c.276 0 .5.224.5.5 0 .975.282 1.884.77 2.65l-.722.721C.888 9.58.5 8.418.5 7.167c0-.276.224-.5.5-.5zm8.277-1.031v1.53C9.278 8.732 8.01 10 6.445 10c-.446 0-.868-.103-1.243-.287l.776-.773c.149.039.306.06.467.06.963 0 1.751-.74 1.828-1.683l.006-.15v-.531l1-1zM6.444 0C8.01 0 9.278 1.268 9.278 2.833l-.002-.025-.999.999v-.974c0-.962-.74-1.75-1.682-1.827L6.445 1c-.962 0-1.751.74-1.828 1.683l-.006.15v4.334c0 .097.008.192.022.285l-.804.805c-.112-.269-.184-.558-.209-.86l-.009-.23V2.833C3.611 1.268 4.88 0 6.444 0z"
          transform="translate(6.5 4)"
        />
        <path
          fill="red"
          d="M12.146.646c.196-.195.512-.195.708 0 .173.174.192.443.057.638l-.057.07-12 12c-.196.195-.512.195-.708 0-.173-.174-.192-.443-.057-.638l.057-.07 12-12z"
          transform="translate(6.5 4)"
        />
      </g>
    </svg>
  );
}
