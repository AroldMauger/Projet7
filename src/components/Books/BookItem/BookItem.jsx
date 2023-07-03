import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './BookItem.module.css';

function BookItem({ book, size }) {
  let title;
  switch (size) {
    case 2:
      title = <h2>{book.title}</h2>;
      break;
    case 3:
      title = <h3>{book.title}</h3>;
      break;
    default:
      title = <h2>{book.title}</h2>;
      break;
  }
  return (
    <Link to={`/livre/${book.id}`} className={styles.BookItem}>
      <article className={styles.BookContainer}>
        <img className={styles.BookImage} src={book.imageUrl} alt={`${book.title}`} />
        <div className={styles.BookInfo}>
          {title}
        </div>
      </article>
    </Link>
  );
}

BookItem.propTypes = {
  size: PropTypes.number.isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
};
export default BookItem;
