import React, { FC } from 'react';
import './MainButton.css';

interface IProps {
  loading?: boolean;
  simple: boolean;
  clickHandler: any;
  actionTitle: string;
}

const MainButton: FC<IProps> = ({
  loading,
  simple,
  clickHandler,
  actionTitle,
}) => {
  return (
    <button
      disabled={loading}
      className={simple ? 'simple' : 'main-button'}
      onClick={clickHandler}
    >
      {actionTitle}
    </button>
  );
};

export default MainButton;
