import React, { useState, useEffect } from 'react';
import BookItem from '../../components/Books/BookItem/BookItem';
import styles from './Home.module.css';
import { getBooks } from '../../lib/common';

function Home() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line max-len
  const displayBooks = () => (books ? books.map((book) => <BookItem size={2} book={book} key={book.id} />) : <h1>Vide</h1>);

  useEffect(() => {
    async function getBooksList() {
      const data = await getBooks();
      if (data) {
        setBooks(data);
        setLoading(false);
      }
    }
    getBooksList();
  }, []);
  return (
    <div className={styles.Home}>
      <main className={styles.main}>
        <section className={styles.bookList}>
          {loading ? <h1>Chargement</h1> : displayBooks()}
        </section>
      </main>

    </div>

  );
}

export default Home;
