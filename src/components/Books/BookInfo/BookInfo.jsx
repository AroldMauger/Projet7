import * as PropTypes from 'prop-types';
import React from 'react';
import styles from '../../../pages/Book/Book.module.css';

function BookInfo({ book }) {
  return (
    <div className={styles.BookInfo}>
      <h1>{book.title}</h1>
    </div>
  );
}

BookInfo.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

export default BookInfo;
