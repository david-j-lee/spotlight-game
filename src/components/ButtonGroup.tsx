import React, { FC } from 'react';
import Button from './Button';
import './ButtonGroup.css';

interface IProps {
  elements: any;
  centered?: boolean;
  icon: boolean;
  mouseEnter?: any;
  mouseLeave?: any;
  disabled?: boolean;
}

const ButtonGroup: FC<IProps> = ({
  elements,
  centered,
  icon,
  mouseEnter,
  mouseLeave,
  disabled,
}) => {
  const className = centered ? 'centered' : 'btn-group';
  return (
    <div
      className={className}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      {elements.map((el, i) => {
        return (
          <Button
            key={i}
            src={el.src}
            icon={icon}
            clickHandler={el.clickHandler}
            alt={el.alt}
            text={el.text}
            disabled={!!disabled}
          />
        );
      })}
    </div>
  );
};

export default ButtonGroup;
