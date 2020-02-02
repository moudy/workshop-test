import * as React from 'react';

const { Button } = window.__COMPONENTS__.Button;

export interface HelloProps {
  compiler: string;
  framework: string;
}

export const Hello = (props: HelloProps) => (
  <h1>
    Hello from {props.compiler} and {props.framework}!
    <Button />
  </h1>
);
