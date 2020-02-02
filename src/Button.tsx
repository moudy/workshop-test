import * as React from 'react';

export interface Props {
  disabled: boolean;
}

const Button: React.FC<Props> = (props) => (
  <button {...props}>test...{props.children}</button>
);

export const ButtonMain: React.FC<Props> = (props) => (
  <button {...props}>{props.children}</button>
);

export default Button;
