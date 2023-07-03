/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../lib/customHooks';
import styles from './Book.module.css';
import { getBook, deleteBook } from '../../lib/common';
import BookInfo from '../../components/Books/BookInfo/BookInfo';

function Book() {
  const { connectedUser } = useUser();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    async function getItem() {
      const data = await getBook(params.id);
      if (data) {
        setBook(data);
        setLoading(false);
      }
    }
    getItem();
  }, []);

  const onDelete = async (e) => {
    if (e.key && e.key !== 'Enter') {
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    const check = confirm('Etes vous sûr de vouloir supprimer cette créature ?');
    if (check) {
      const del = await deleteBook(book.id);
      if (del) {
        setBook((oldValue) => ({ ...oldValue, delete: true }));
      }
    }
  };

  const loadingContent = <h1>Chargement ...</h1>;

  const bookContent = !loading && !book.delete ? (
    <div>
      <div className={styles.Book}>
        <div className={styles.BookImage} style={{ backgroundImage: `url(${book.imageUrl})` }} />
        <div className={styles.BookContent}>
          {book?.userId === connectedUser?.userId ? (
            <div className={styles.Owner}>
              <p>
                <span tabIndex={0} role="button" onKeyUp={onDelete} onClick={onDelete}>supprimer</span>
                {' '}
              </p>
            </div>
          ) : null}
          <BookInfo book={book} />
        </div>
      </div>
    </div>
  ) : null;

  const deletedContent = book?.delete ? (
    <div className={styles.Deleted}>
      <h1>{book.title}</h1>
      <p>a bien été supprimé</p>
    </div>
  ) : null;

  return (
    <div className="content-container">
      {loading ? loadingContent : null}
      <div className={styles.BookContainer}>
        {bookContent}
      </div>
      {book?.delete ? deletedContent : null}
    </div>
  );
}

export default Book;
