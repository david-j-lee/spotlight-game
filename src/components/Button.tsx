import React, { FC } from 'react';
import './Button.css';

interface IProps {
  icon: boolean;
  clickHandler: any;
  src: string;
  text: string;
  alt: string;
  disabled: boolean;
}

const Button: FC<IProps> = ({
  icon,
  clickHandler,
  src,
  alt,
  text,
  disabled,
}) => {
  return (
    <div className="encasing-div">
      {icon && (
        <img
          className="button-icon"
          src={src}
          alt={alt}
          onClick={clickHandler}
        />
      )}
      {!icon && (
        <button
          className={disabled ? 'button disabled' : 'button'}
          onClick={clickHandler}
          disabled={disabled}
        >
          {text}
        </button>
      )}
    </div>
  );
};

export default Button;
