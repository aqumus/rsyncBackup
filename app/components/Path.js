// @flow
import React, { Component } from 'react';
import styles from './Path.css';

type PathProps = {
  sourceList: Array<string>,
  onSourceItemRemove: (index: number) => void
};

export const Path = (props: PathProps) => {
  const { sourceList, onSourceItemRemove } = props;
  return (
    <ul className={styles['source-path-container']}>
      {sourceList.map((source, i) => (
        <li className={styles['source-path-item']} key={source}>
          <i className="far fa-folder" />
          <span className={styles['source-path-item-path']}>{source}</span>
          <div className={styles['source-path-item-remove']}>
            <i
              role="button"
              tabIndex={0}
              className="far fa-trash-alt"
              onKeyDown={() => onSourceItemRemove(i)}
              onClick={() => onSourceItemRemove(i)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
